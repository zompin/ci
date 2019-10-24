const Koa = require('koa');
const koaBody = require('koa-body');
const exec = require('child_process').execSync;
const { resolve } = require('path');
const serve = require('koa-static')(resolve(__dirname, 'public'));
const config = require('config');
const webhook = require('./api/webhook');
const prepareRepository = require('./middlewares/prepareRepository');

const port = config.get('port');

const app = new Koa();

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

  // try {
  //   const tmp = require('../commands');
  //
  //   if (tmp[name] && tmp[name][branch]) {
  //     commands = [...commands, ...tmp[name][branch]];
  //   }
  // } catch (e) {
  //   console.warn('"commands.json" not found');
  // }

  commands.forEach((c) => {
    let tmp = {};

    try {
      tmp = exec(c);
    } catch (e) {
      tmp = e;
    }

    result.push(tmp.toString());
  });

  ctx.body = result;
}

app.use(koaBody({
  multipart: true,
  urlencoded: true,
}));

app.use(serve);
app.use(webhook);
app.use(prepareRepository);
app.listen(port);
