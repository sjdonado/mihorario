const moment = require('moment');

const ApiError = require('../../../lib/ApiError');
const { request } = require('../../../services/apolloLink');

const {
  USER_QUERY,
  TERMS_QUERY,
  SCHEDULE_QUERY,
} = require('../../../graphql/queries');

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (credentials) => {
  try {
    const userResponse = await request(credentials, USER_QUERY);
    const fullName = userResponse.data.user.name;

    const termsResponse = await request(credentials, TERMS_QUERY);
    const terms = termsResponse.data.terms;

    return { fullName, terms };
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
const pomeloSchedule = async (credentials, termId) => {
  try {
    const scheduleResponse = await request(credentials, SCHEDULE_QUERY, { termId });
    const data = scheduleResponse.data.schedule;
    console.log('data', data);

    const subjectsByDays = [[], [], [], [], [], [], []];
    data.forEach(({
      courseName,
      sectionId,
      sectionTitle,
      firstMeetingDate,
      lastMeetingDate,
      instructors,
      meetings,
    }) => {
      meetings.forEach(({
        buildingId,
        room,
        dates,
      }) => {
        dates.forEach(({ start, end, startTime, endTime }) => {
          const parsedStartTime = moment(startTime, 'HH:mm').utcOffset(-5);
          const parsedEndTime = moment(endTime, 'HH:mm').utcOffset(-5);
          const startDate = moment(start);
          const endDate = moment(end);
          const weekdayParsed = startDate.weekday() - 1 < 0 ? 6 : startDate.weekday() - 1;

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
            firstMeetingDate,
            lastMeetingDate,
          });
        })
      })
    });

    const scheduleByHours = Array.from(Array(14), () => new Array(6));
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
    // console.log('errors =>', err.result.errors);
    throw new ApiError(err);
  }
};

module.exports = {
  pomeloSchedule,
  pomeloSchedulePeriods,
};
