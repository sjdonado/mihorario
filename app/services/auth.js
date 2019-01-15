/**
 * AuthService - Session management
 * @author krthr
 * @since 1.0.0
 */

<<<<<<< HEAD
const { reportError } = require("./raven");
=======
>>>>>>> refactor: calendarService, Cookies sessions, Google oauth
const passport = require("passport");
const { google } = require('googleapis');
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;
<<<<<<< HEAD
const { createClient } = require("./calendar");
const { getUserCode } = require("./api");
=======

const {
  reportError
} = require('./raven')

const {
  getUserCode
} = require('./api')
>>>>>>> refactor: calendarService, Cookies sessions, Google oauth

const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK
);

/**
 * Login para Google
 */
<<<<<<< HEAD
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      createClient(accessToken);
      return done(null, profile);
    }
  )
);
=======
// passport.use(
//   new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK
//     },
//     (accessToken, refreshToken, profile, done) => {
//       profile.accessToken = accessToken;
//       oauth2Client.setCredentials({
//         access_token: accessToken,
//         refresh_token: refreshToken,
//         expiry_date: true
//       });
//       createClient(oauth2Client);
//       return done(null, profile);
//     }
//   )
// );
>>>>>>> refactor: calendarService, Cookies sessions, Google oauth

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
<<<<<<< HEAD
  passport
};
=======
  passport,
  oauth2Client,
  scopes,
};
>>>>>>> refactor: calendarService, Cookies sessions, Google oauth
