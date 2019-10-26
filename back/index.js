const Koa = require('koa');
const koaBody = require('koa-body');
const { resolve } = require('path');
const serve = require('koa-static')(resolve(__dirname, 'public'));
const config = require('config');
const webhook = require('./api/webhook');

const port = config.get('port');

const app = new Koa();

app.use(koaBody({
  multipart: true,
  urlencoded: true,
}));

app.use(serve);
app.use(webhook);
app.listen(port);
