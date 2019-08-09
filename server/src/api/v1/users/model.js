// const moment = require('moment');
const { scraper } = require('../../../lambdaFunctions');
const ApiError = require('../../../lib/ApiError');

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (username, password) => {
  try {
    const data = await scraper({
      action: 'pomeloSchedulePeriods',
      username,
      password,
    });
    const { options, fullName } = data;
    return { options, fullName };
  } catch (err) {
    console.log('err', err);
    throw new ApiError('Invalid credentials', 400);
  }
};

/**
 * Get Pomelo schedule
 * @param {String} username
 * @param {String} password
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (username, password, scheduleOption) => {
  try {
    const data = await scraper({
      action: 'pomeloSchedule',
      username,
      password,
      scheduleOption,
    });
    const { scheduleByHours, subjectsByDays } = data;
    return { scheduleByHours, subjectsByDays };
  } catch (err) {
    console.log('err', err);
    throw new ApiError(err);
  }
};

module.exports = {
  pomeloSchedule,
  pomeloSchedulePeriods,
};
