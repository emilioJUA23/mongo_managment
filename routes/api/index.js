const express = require('express');
const app = express();

app.use(require('./v1'));

module.exports = app;