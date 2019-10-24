function getRep(ctx) {
  const payload = JSON.parse(ctx.request.body.payload);
  const ref = payload.ref.split('/');
  const { name } = payload.repository;
  const branch = ref.pop();

  return {
    name,
    branch,
    payload,
  };
}

module.exports = async (ctx, next) => {
  if (!ctx.HOOK) {
    return next();
  }

  ctx.REPO = getRep(ctx);

  return next();
};
