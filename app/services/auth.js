const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;
const {
  createClient
} = require('./calendar')
const {
  getUserCode
} = require('./api')

/**
 * Login para Google
 */
passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.callback
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      createClient(accessToken)
      return done(null, profile);
    }
  )
);

/**
 * Login para la cuenta de Uninorte
 */
passport.use(
  new LocalStrategy({
      usernameField: 'user',
      passwordField: 'pass'
    },
    (username, password, done) => {
      getUserCode(username, password)
        .then(res => {
          res.u = username
          res.p = password
          return done(null, res)
        }).catch(err => {
          return done(null, false)
        })
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = {
  passport
};