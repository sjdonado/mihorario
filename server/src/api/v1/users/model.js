const moment = require('moment');
const logger = require('../../../utils/logger');

const ApiError = require('../../../lib/ApiError');
const PomeloService = require('../../../services/pomelo');

/**
 * Get pomelo userId
 * @param {{ username: String, password: String }} credentials
 */
const pomeloUserId = (credentials) => {
  try {
    const client = new PomeloService(credentials);
    return client.getUserId();
  } catch (err) {
    logger.error(err, { message: 'Invalid credentials' });
    throw new ApiError('Invalid credentials', 400);
  }
};

/**
 * Get pomelo schedule terms
 * @param {{ username: String, password: String }} credentials
 * @param {String} userId
 */
const pomeloScheduleTerms = async (credentials, userId) => {
  try {
    const client = new PomeloService(credentials);
    return client.getFullNameAndTerms(userId);
  } catch (err) {
    throw new ApiError(err, 400);
  }
};

/**
 * Get pomelo schedule
 * @param {{ username: String, password: String }} credentials
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (credentials, userId, termId) => {
  try {
    const client = new PomeloService(credentials);
    const data = await client.getSchedule(userId, termId);

    const subjectsByDays = [[], [], [], [], [], [], []];
    data.forEach(({
      courseName,
      sectionId,
      sectionTitle,
      instructors,
      meetings,
    }) => {
      meetings.forEach(({
        buildingId,
        room,
        dates,
      }) => {
        dates.forEach(({
          start,
          end,
          startTime,
          endTime,
        }) => {
          const parsedStartTime = moment(startTime, 'HH:mm').utcOffset(-5);
          const parsedEndTime = moment(endTime, 'HH:mm').utcOffset(-5);
          const startDate = moment(start);
          const endDate = moment(end);
          const weekdayParsed = endDate.weekday() < 0 ? 6 : endDate.weekday();

          if (startDate.month() !== endDate.month()) {
            subjectsByDays[weekdayParsed].push({
              nrc: sectionId,
              name: sectionTitle,
              shortName: sectionTitle,
              instructors: instructors.join(','),
              type: courseName,
              place: `${buildingId} ${room}`,
              startTime: parsedStartTime.format('hh:mm A'),
              endTime: parsedEndTime.format('hh:mm A'),
              startDate: startDate.format('MMM DD, YYYY', 'es'),
              endDate: endDate.format('MMM DD, YYYY', 'es'),
            });
          }
        });
      });
    });

    const scheduleByHours = Array.from(Array(18), () => new Array(6));
    subjectsByDays.forEach((day, index) => {
      day.forEach((row) => {
        const startSubjectDate = moment(row.startTime, 'hh:mm A');
        const endSubjectDate = moment(row.endTime, 'hh:mm A');

        let startSubjectInt = parseInt(startSubjectDate.hours(), 10);
        if (startSubjectInt < 6) startSubjectInt = 6;
        const endSubjectInt = parseInt(endSubjectDate.hours(), 10);

        while (endSubjectInt - startSubjectInt >= 1) {
          scheduleByHours[startSubjectInt - 6][index] = Object.assign({}, row, {
            startParsedTime: `${startSubjectInt}:${startSubjectDate.minutes()}`,
            endParsedTime: `${startSubjectInt + 1}:${endSubjectDate.minutes()}`,
            startDate: moment(row.startDate, 'MMM DD, YYYY', 'es'),
            endDate: moment(row.endDate, 'MMM DD, YYYY', 'es'),
          });
          startSubjectInt += 1;
        }
      });
    });

    return { scheduleByHours, subjectsByDays };
  } catch (err) {
    logger.error(err);
    throw new ApiError(err);
  }
};

module.exports = {
  pomeloUserId,
  pomeloScheduleTerms,
  pomeloSchedule,
};
