const express = require('express');
const app = express();

app.use(require('./login'));
app.use(require('./rol'));
app.use(require('./usuario'));
app.use(require('./vista'));

module.exports = app;