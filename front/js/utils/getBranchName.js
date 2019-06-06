export default (event) => {
  if (!event || !event.payload || !event.payload.ref) {
    return '';
  }

  const ref = event.payload.ref.split('/');

  return ref.pop();
};
