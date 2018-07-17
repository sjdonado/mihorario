require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const cookieEncrypter = require('cookie-encrypter')
const bodyParser = require('body-parser')
const logger = require('morgan');
const helmet = require('helmet')
const session = require('express-session')
const {
  passport
} = require('./app/services/auth')
const app = express();

app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
/* app.use(cookieSession({
  name: 'data_',
  keys: ['plzAUsNTbTDIfgLQrkr92v8rHNdUtiK7'],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  signed: true
})) */
app.use(cookieParser(process.env.SECRET));
app.use(cookieEncrypter(process.env.SECRET))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/', require('./app/router'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;