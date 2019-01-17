/**
 * AuthController - Auth management
 * @author krthr
 * @since 1.0.0
 */

const AuthRouter = require("express").Router();
const { passport, scopes, oauth2Client } = require("../services/authService");
const { login } = require("../services/authService");

/**
 * [POST] Login with U credentials
 * @param user Username
 * @param pass Password
 */
AuthRouter.post("/login", async (req, res) => {
  const { user, pass } = req.body;

  // console.log(req.body);

  if (!user || !pass) return res.redirect("/");

  try {
    const userCode = await login(user, pass);

    req.session.user = userCode;
    req.session.user.user = user;
    req.session.user.pass = pass;

    return res.redirect("/auth/google");
  } catch (e) {
    //console.log(e);
    return res.redirect("/");
  }
});

/**
 * [GET] Login with Google Account using passport
 */
AuthRouter.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  res.redirect(url);
});

/**
 * [GET] Callback for Google login
 */
AuthRouter.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  req.session.tokens = tokens;
  res.redirect("/subjects");
});

/**
 * [GET] Close session
 */
AuthRouter.get("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/");
});

module.exports = AuthRouter;
