const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const sandbox = 'sandbox';
const deployKeyDir = '/home/sites/deploy';

module.exports = async (ctx, next) => {
  if (!ctx.REPO) {
    return next;
  }

  const workDir = path.join(__dirname, sandbox);
  const { name, branch, url } = ctx.REPO;
  const thread = path.join(workDir, branch, name);

  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  // TODO проверять deployKey
  if (!fs.existsSync(thread)) {
    childProcess.execSync(`ssh-agent sh -c '${deployKeyDir}; git clone ${url} ${thread}'`);
  } else {
    childProcess.execSync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} reset --hard`);
    childProcess.execSync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
    childProcess.execSync(`ssh-agent sh -c '${deployKeyDir}; git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} git pull`);
  }

  const commandPrefix = `yarn --cwd ${thread}`;

  childProcess.execSync(`${commandPrefix} prep`);

  return next();
};
