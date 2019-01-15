/**
 * AuthService - Session management
 * @author krthr
 * @since 1.0.0
 */

const { reportError } = require("./raven");
const passport = require("passport");
const { google } = require('googleapis');
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;

const {
  getUserCode
} = require('./api')

const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

/**
 * Login para Google
 */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK
);

/**
 * Login para la cuenta de Uninorte
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "user",
      passwordField: "pass"
    },
    (username, password, done) => {
      getUserCode(username, password)
        .then(res => {
          res.u = username;
          res.p = password;
          return done(null, res);
        })
        .catch(err => {
          reportError(err, {});
          return done(null, false, {
            message: "Credenciales incorrectas."
          });
        });
    }
  )
);

/**
 * Save session
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Remove session
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {
  passport,
  oauth2Client,
  scopes,
};
