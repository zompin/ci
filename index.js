const Koa = require('koa');
const bodyParser = require('koa-body');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = new Koa();

console.log(bodyParser())

app.use(bodyParser());

app.use(async (ctx) => {
    console.log(ctx.request)
    const body = ctx.request.body || {};
    const payload = body.payload || { ref: '' };
    const ref = payload.ref.split('/');
    const branch = ref.pop();
    const re = /[^\d-]/g;
    let result = '';

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

app.listen(5556);
