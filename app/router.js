const Router = require('express').Router()
const AuthController = require('./constrollers/AuthController')
const PagesController = require('./constrollers/PagesController')
const GoogleApiController= require('./constrollers/GoogleCalendarController')

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else return res.redirect('/')
}

Router.use('/auth', AuthController)
Router.use('/calendar', isLogged, GoogleApiController)
Router.use('/', PagesController)

module.exports = Router