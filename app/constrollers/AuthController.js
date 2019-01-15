/**
 * AuthController - Auth management
 * @author krthr
 * @since 1.0.0
 */

const AuthRouter = require("express").Router();
const { passport, scopes, oauth2Client } = require("./../services/auth");

/**
 * [POST] Login with U credentials
 * @param user Username
 * @param pass Password
 */
AuthRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true
  }),
  (req, res) => {
    return res.redirect("/auth/google");
  }
);

/**
 * [GET] Login with Google Account using passport
 */
AuthRouter.get(
  "/google",
  (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
    res.redirect(url);
  }
);

/**
 * [GET] Callback for Google login
 */
AuthRouter.get(
  "/callback",
  async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;
    res.redirect("/subjects");
  }
);

/**
 * [GET] Close session
 */
AuthRouter.get("/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

module.exports = AuthRouter;
