const { pomeloSchedule } = require('./model');
const { setRecord, getRecords, removeRecords } = require('../../../services/redis');
const { signToken } = require('../../../services/auth');

const getSchedule = async (req, res, next) => {
  try {
    const { password } = await getRecords(req.username);
    const data = await pomeloSchedule(req.username, password);
    await setRecord(req.username, 'pomeloData', JSON.stringify(data));

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      username,
      password,
    } = req.body;

    if (!username || !password) next(new Error('Bad request'));

    await setRecord(username, 'password', password);
    const token = signToken({ username });
    res.json({ data: { token } });
  } catch (err) {
    next(err);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const {
      gauthAccessToken,
      gauthRefreshToken,
    } = req.body;

    if (!gauthAccessToken || !gauthRefreshToken) next(new Error('Bad request'));

    await setRecord(req.username, 'accessToken', gauthAccessToken);
    await setRecord(req.username, 'refreshToken', gauthRefreshToken);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await removeRecords(req.username);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSchedule,
  login,
  logout,
  googleLogin,
};
