const mongoose = require('mongoose');
const config = require('config');

const { host, port, name } = config.get('db');

mongoose.connect(`${host}:${port}/${name}`, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
