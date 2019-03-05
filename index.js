const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = new Koa();

app.use(bodyParser({
    enableTypes: ['text', 'form', 'json']
}));

app.use(async (ctx) => {
    const payload = JSON.parse(ctx.request.body.payload);
    const ref = payload.ref.split('/');
    const branch = ref.pop();
    const re = /[^\d-]/g;
    let result = '';

    if (ctx.method === 'POST') {
        try {
            if (re.test(branch)) {
                throw new Error();
            }
            result = await exec(`pwd && cd ../${branch}/hi && git checkout ${branch} && git pull origin ${branch}`);
            console.log(result)
        } catch (e) {
            result = e;
        }

        ctx.body = result;
    } else {
        ctx.throw(400);
    }
});

app.listen(5556);
