const ApiError = require('../../../lib/ApiError');
const { pomeloSchedule, pomeloSchedulePeriods } = require('./model');
const { signToken } = require('../../../services/auth');

const getSchedule = async (req, res, next) => {
  try {
    const { scheduleOption } = req.query;
    if (!scheduleOption) throw new ApiError('Schedule period is not valid', 400);

    const { username, password } = req.user;

    const data = await pomeloSchedule(
      username,
      password,
      scheduleOption,
    );

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
    const token = signToken({ username, password });

    res.json({ data: { token, pomelo } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSchedule,
  login,
};
