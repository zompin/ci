const Koa = require('koa');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = new Koa();

app.use(async (ctx) => {
    const body = ctx.request.body || {};
    const payload = body.payload || { ref: '' };
    const ref = payload.ref.split('/');
    const branch = ref.pop();
    const re = /[^\d-]/g;
    let result = '';
    console.log(ctx.request.body)

    if (ctx.method === 'POST') {
        try {
            if (re.test(branch)) {
                throw new Error();
            }
            result = await exec(`cd ../${branch} && cd hi git pull origin ${branch}`);
        } catch (e) {
            result = e;
        }

        ctx.body = result;
    } else {
        ctx.throw(400);
    }
});

app.listen(5555);
