const AuthRouter = require("express").Router();
const {
  passport
} = require('./../services/auth')

AuthRouter.post("/login",
  passport.authenticate('local', {
    failureRedirect: '/'
  }),
  (req, res) => {
    return res.redirect('/auth/google')
  }
)

AuthRouter.get(
  "/google",
  passport.authenticate('google', {
    session: false,
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/plus.me'
    ]
  }))

AuthRouter.get("/callback", passport.authenticate('google', {
  session: false,
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/subjects');
})

AuthRouter.get('/logout', (req, res) => {
  req.logout()
  return res.redirect('/')
})

module.exports = AuthRouter;