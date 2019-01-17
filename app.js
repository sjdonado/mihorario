require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const logger = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const app = express();

app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger(process.env.NODE_ENV == "production" ? "tiny" : "dev"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 600000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// Rutas
app.use("/", require("./app/router"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
