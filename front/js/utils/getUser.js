export default (e) => {
  if (!e || !e.payload || !e.payload.pusher) {
    return '';
  }

  return e.payload.pusher.name;
};
