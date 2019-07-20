const ApiError = require('../../../lib/ApiError');
const { pomeloSchedule, pomeloSchedulePeriods } = require('./model');

const { setRecord, getRecords, removeRecords } = require('../../../services/redis');
const { encryptPassword, decryptPassword } = require('../../../services/cryptr');
const { signToken } = require('../../../services/auth');

const getSchedule = async (req, res, next) => {
  try {
    const { scheduleOption } = req.query;
    if (!scheduleOption) throw new ApiError('Schedule period is not valid', 400);

    const { password } = await getRecords(req.username);
    const data = await pomeloSchedule(req.username, decryptPassword(password), scheduleOption);
    await setRecord(req.username, 'schedule', JSON.stringify(data));

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

    if (!username || !password) next(new ApiError('Bad request', 400));

    const pomelo = await pomeloSchedulePeriods(username, password);

    if (await getRecords(username)) await removeRecords(username);

    await setRecord(username, 'password', encryptPassword(password));
    const token = signToken({ username });

    res.json({ data: { token, pomelo } });
  } catch (err) {
    next(err);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const {
      accessToken,
      refreshToken,
    } = req.body;

    if (!accessToken || !refreshToken) next(new ApiError('Bad request', 400));

    await setRecord(req.username, 'accessToken', accessToken);
    await setRecord(req.username, 'refreshToken', refreshToken);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({ data: await removeRecords(req.username) });
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
