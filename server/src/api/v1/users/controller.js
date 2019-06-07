const { pomeloAuth, pomeloLogout } = require('./model');

const login = async (req, res, next) => {
  const { userName, password } = req.body;
  const { page, browser } = await pomeloAuth(userName, password);
  req.session.page = page;
  req.session.browser = browser;
};

const logout = async (req, res, next) => {
  await pomeloLogout(req.session.browser);
};

module.exports = {
  login,
  logout,
};
