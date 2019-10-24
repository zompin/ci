const Router = require('koa-router');

const router = new Router();

router.post('/api/v1/webhook', async (ctx) => {
  ctx.HOOK = ctx.request.body.payload;
  ctx.body = 'ok';
});

module.exports = router.routes();
