/**
 * Router
 * @author krthr
 * @since 1.0.0
 */

const Router = require("express").Router();
const AuthController = require("./constrollers/AuthController");
const PagesController = require("./constrollers/PagesController");
const GoogleApiController = require("./constrollers/GoogleCalendarController");

const isLogged = (req, res, next) => {
  // req.isAuthenticated()
  if (req.body.tokens) next()
  else return res.redirect('/')
}

Router.use("/auth", AuthController);
Router.use("/calendar", isLogged, GoogleApiController);
Router.use("/", PagesController);

module.exports = Router;
