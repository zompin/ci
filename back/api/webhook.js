const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const mock = require('./mock');

const router = new Router();
const sandbox = 'workdir';

function getRep(payload) {
  const ref = payload.ref.split('/');
  const { name } = payload.repository;
  const branch = ref.pop();

  return {
    name,
    branch,
  };
}

function getRepositoryCommands(thread, branch) {
  try {
    const str = fs.readFileSync(path.join(thread, 'commands.json')).toString();
    const json = JSON.parse(str);
    const res = json[branch] || json.default || [];
    return res.map(c => `cd ${thread} && PWD=${thread} exec ${c}`);
  } catch (e) {
    console.log(e);
  }

  return [];
}

async function hook(payload) {
  const workDir = path.join(process.cwd(), sandbox);
  const { name, branch } = getRep(payload);
  const thread = path.join(workDir, branch, name);
  const deployKey = path.join(workDir, 'deploy');
  let commandsQueue = [];

  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  // TODO проверять deployKey
  if (!fs.existsSync(thread)) {
    commandsQueue.push(`ssh-agent sh -c 'ssh-add ${deployKey}; git clone ${payload.repository.ssh_url} ${thread}'`);
    commandsQueue.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
  } else {
    commandsQueue.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} reset --hard`);
    commandsQueue.push(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
    commandsQueue.push(`ssh-agent sh -c 'ssh-add ${deployKey}; git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} pull'`);
  }
  const repositoryCommands = getRepositoryCommands(thread, branch);
  commandsQueue = [...commandsQueue, ...repositoryCommands];

  try {
    commandsQueue.forEach((c) => {
      console.log(execSync('pwd').toString())
      console.log(c);
      execSync(c);
    });
  } catch (e) {
    console.error(e);
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
