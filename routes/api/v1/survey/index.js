const express = require('express');
const app = express();

app.use(require('./answer'));
app.use(require('./results'));
app.use(require('./instrument'));

module.exports = app;