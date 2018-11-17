const express = require('express');
const app = express();

app.use(require('./security'));

module.exports = app;