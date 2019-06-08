const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const redis = require('redis');

const RedisStore = require('connect-redis')(session);
const config = require('./config');

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

const api = require('./api/v1/');

const app = express();

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

app.use(session({
  secret: config.session.secret,
  name: config.session.name,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new RedisStore(Object.assign(config.redis, { client: redisClient })),
}));

// app.use(cors({
//   origin: ['http://localhost'],
//   credentials: true,
// }));

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
