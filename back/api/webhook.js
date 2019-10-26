const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const mock = require('./mock');

const execAsync = promisify(exec);
const router = new Router();
const sandbox = 'sandbox';
const deployKeyDir = path.join(process.cwd(), 'keys', 'deploy');

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

  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  // TODO проверять deployKey
  if (!fs.existsSync(thread)) {
    await execAsync(`ssh-agent sh -c '${deployKeyDir}; git clone ${payload.repository.ssh_url} ${thread}'`);
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
  } else {
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} reset --hard`);
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
    await execAsync(`ssh-agent sh -c '${deployKeyDir}; git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} pull'`);
  }
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
