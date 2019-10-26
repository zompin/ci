const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const { promisify } = require('util');
const mock = require('./mock');

const execAsync = promisify(exec);
const router = new Router();
const sandbox = 'sandbox';

function getRep(payload) {
  const ref = payload.ref.split('/');
  const { name } = payload.repository;
  const branch = ref.pop();

  return {
    name,
    branch,
  };
}

async function hook(payload) {
  const workDir = path.join(process.cwd(), sandbox);
  const { name, branch } = getRep(payload);
  const thread = path.join(workDir, branch, name);
  const deployKeyDir = path.join(process.cwd(), 'keys', 'deploy');
  const commands = [];

  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  // TODO проверять deployKey
  if (!fs.existsSync(thread)) {
    commands.push(`ssh-agent sh -c 'ssh-add ${deployKeyDir}; git clone ${payload.repository.ssh_url} ${thread}'`);
    commands.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
  } else {
    commands.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} reset --hard`);
    commands.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
    commands.push(`ssh-agent sh -c 'ssh-add ${deployKeyDir}; git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} pull'`);
  }

  console.error('-----');
  console.error(commands);
  console.error('-----');

  commands.forEach((c) => {
    execSync(c);
  });
}

router.post('/api/v1/webhook', async (ctx) => {
  ctx.body = 'ok';
  hook(JSON.parse(ctx.request.body.payload));
});

router.get('/api/v1/webhook', async (ctx) => {
  ctx.body = 'ok';
  hook(mock);
});

module.exports = router.routes();
