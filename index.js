const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = new Koa();

app.use(bodyParser());

app.use(async (ctx) => {
    console.log(ctx.request)
    const payload = ctx.request.rawBody.payload;
    const body = JSON.parse(payload)
    console.log(body)
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
