const express = require('express');
const cors = require('cors');

const logger = require('./utils/logger');
const api = require('./api/v1');
const { server } = require('./config');

const app = express();

app.use(cors({
  origin: [server.clientName],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  logger.error(err);
  res.status(statusCode);
  res.json({
    error: true,
    message,
  });
});

module.exports = app;
