const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = require('./api/v1/');
const { server } = require('./config');

const app = express();

app.use(cors({
  origin: [server.clientName],
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', api);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: true,
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  const {
    statusCode = 500, message,
  } = err;

  console.log('ERROR', err);
  console.log('ERROR_MESSAGE', message);

  res.status(statusCode);
  res.json({
    error: true,
    message,
  });
});

module.exports = app;
