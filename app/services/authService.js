/**
 * AuthService - Session management
 * @author krthr
 * @since 1.0.0
 */

const { google } = require("googleapis");
const { getUserCode } = require("./api");

const scopes = [
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/calendar"
];

/**
 * Login para Google
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK
);

const login = async (user, pass) => {
  try {
    return await getUserCode(user, pass);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  oauth2Client,
  scopes,
  login
};
