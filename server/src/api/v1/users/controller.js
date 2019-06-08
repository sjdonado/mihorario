const { pomeloAuth, pomeloLogout, pomeloSchedule } = require('./model');

const schedule = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const data = await pomeloSchedule(username, password);
    req.session.user = data;

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  res.session.user = null;
  res.json({ data: [] });
};

module.exports = {
  logout,
  schedule,
};
