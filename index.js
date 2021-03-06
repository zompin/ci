const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const exec = require('child_process').execSync;
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const serve = require('koa-static')(resolve(__dirname, 'public'));
const config = require('config');

const port = config.get('port');
const timeout = config.get('timeout');

const app = new Koa();

function getRep(ctx) {
  const payload = JSON.parse(ctx.request.body.payload);
  const ref = payload.ref.split('/');
  const name = payload.repository.name;
  const branch = ref.pop();

  return {
    name,
    branch,
    payload,
  };
}

function post(ctx) {
  let rep = { name: '', branch: '' };

  try {
    rep = getRep(ctx);
  } catch (e) {}

  const { name, branch, payload } = rep;
  const result = [];
  let commands = [
    `git --work-tree=./${branch}/${name} --git-dir=./${branch}/${name}/.git checkout .`,
    `git --work-tree=./${branch}/${name} --git-dir=./${branch}/${name}/.git pull origin ${branch}`,
    `yarn --cwd ./${branch}/${name} prep`,
  ];

  try {
    const tmp = require('./commands');

    if (tmp[name] && tmp[name][branch]) {
      commands = [...commands, ...tmp[name][branch]];
    }
  } catch (e) {
    console.warn('"commands.json" not found')
  }

  if (!name || !branch || !payload) {
    ctx.throw(400);
  }

  commands.forEach((c) => {
    let tmp = {};

    try {
      tmp = exec(c);
    } catch (e) {
      tmp = e;
    }

    result.push(tmp.toString());
  });

  writeFileSync(
    resolve(__dirname, 'public/ci.log'),
    `${JSON.stringify({ payload, result })}\n`, { flag: 'a' },
  );

  ctx.body = result;
}

function get(ctx) {
  ctx.throw(400);
}

app.use(bodyParser({
  enableTypes: ['text', 'form', 'json'],
}));

app.use(serve);

app.use(async (ctx) => {
  switch (ctx.method) {
  case 'POST':
    post(ctx);
    break;
  case 'GET':
    get(ctx);
    break;
  default:
    ctx.throw(400);
  }
});

const server = app.listen(port);
server.timeout = timeout;
