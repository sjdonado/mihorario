/**
 * AuthController - Auth management
 * @author krthr
 * @since 1.0.0
 */

const AuthRouter = require("express").Router();
const {
  passport
} = require('./../services/auth')

/**
 * [POST] Login with U credentials
 * @param user Username
 * @param pass Password
 */
AuthRouter.post("/login",
  passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }),
  (req, res) => {
    return res.redirect('/auth/google')
  }
)

/**
 * [GET] Login with Google Account using passport
 */
AuthRouter.get(
  "/google",
  passport.authenticate('google', {
    session: false,
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/plus.me'
    ]
  }))

/**
 * [GET] Callback for Google login
 */
AuthRouter.get("/callback", passport.authenticate('google', {
  session: false,
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/subjects');
})

/**
 * [GET] Close session
 */
AuthRouter.get('/logout', (req, res) => {
  req.logout()
  return res.redirect('/')
})

module.exports = AuthRouter;