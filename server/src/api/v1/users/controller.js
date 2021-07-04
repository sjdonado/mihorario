const ApiError = require('../../../lib/ApiError');
const { pomeloSchedule, pomeloUserId, pomeloScheduleTerms } = require('./model');
const { signToken } = require('../../../services/auth');

const getSchedule = async (req, res, next) => {
  try {
    const { termId } = req.query;
    if (!termId) throw new ApiError('Start date is not valid', 400);

    const { credentials, userId } = req.user;

    const data = await pomeloSchedule(credentials, userId, termId);

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) next(new ApiError('Bad request', 400));

    const credentials = { username, password };

    const userId = await pomeloUserId(credentials);
    const token = signToken({ credentials, userId });

    const pomelo = await pomeloScheduleTerms(credentials, userId);

    res.json({ data: { token, pomelo } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSchedule,
  login,
};
