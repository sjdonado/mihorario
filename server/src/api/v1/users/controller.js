const { pomeloSchedule } = require('./model');

const getSchedule = async (req, res, next) => {
  try {
    const { username, password } = req.session.user;
    const data = await pomeloSchedule(username, password);
    req.session.pomelo = data;

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const {
    username,
    password,
    gauthAccessToken,
    gauthRefreshToken,
  } = req.body;

  if (username && password && gauthAccessToken && gauthRefreshToken) {
    req.session.user = {
      username,
      password,
      tokens: {
        access_token: gauthAccessToken,
        refresh_token: gauthRefreshToken,
      },
    };
  } else {
    next(new Error('Bad request'));
  }

  res.status(204).json();
};

const logout = async (req, res, next) => {
  req.session.user = null;
  req.session.pomelo = null;
  res.status(204).json();
};

module.exports = {
  getSchedule,
  login,
  logout,
};
