const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = new Koa();

function getRep(ctx) {
    const payload = JSON.parse(ctx.request.body.payload);
    const ref = payload.ref.split('/');
    const name = payload.repository.name;
    const branch = ref.pop();

    return {
        name,
        branch,
    }
}

app.use(bodyParser({
    enableTypes: ['text', 'form', 'json']
}));

app.use(async (ctx) => {
    let rep = { name: '', branch : '' };

    try {
        rep = getRep(ctx);
    } catch (e) {}

    const { name, branch } = rep;
    let result = '';

    if (ctx.method === 'POST' && name && branch) {
        result = await exec(`pwd && cd ../${branch}/${name} && git checkout ${branch} && git pull origin ${branch}`);

        ctx.body = result;
    } else {
        ctx.throw(400);
    }
});

app.listen(5556);
