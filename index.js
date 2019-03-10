const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const exec = require('child_process').execSync;
const app = new Koa();
const { writeFileSync } = require('fs');

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
    let result = [];

    if (ctx.method === 'POST' && name && branch) {
        const commands = [
            'pwd',
            `git --work-tree=./${branch}/${name} --git-dir=./${branch}/${name}/.git checkout .`,
            `git --work-tree=./${branch}/${name} --git-dir=./${branch}/${name}/.git pull origin ${branch}`,
            `yarn --cwd ./${branch}/${name} prep`,
        ];

        commands.forEach((c) => {
            let tmp = {};

            try {
                tmp = exec(c);
            } catch (e) {
                tmp = e;
            }

            result.push(tmp.toString());
        });

        result.forEach(r => {
            writeFileSync(`log-${name}-${branch}.log`, JSON.stringify(r), { flag: 'a' });
        });

        ctx.body = result;
    } else {
        ctx.throw(400);
    }
});

app.listen(5556);
