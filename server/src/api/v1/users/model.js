const ApiError = require('../../../lib/ApiError');
const { request } = require('../../../services/apolloLink');

const { USER_QUERY, TERMS_QUERY } = require('../../../graphql/queries');

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (username, password) => {
  try {
    const credentials = {
      username,
      password,
    };
    const userRes = await request(credentials, USER_QUERY);
    const fullName = userRes.data.user.name;

    const tersmRes = await request(credentials, TERMS_QUERY);
    const options = tersmRes.data.terms;

    console.log('res', { options, fullName });
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
