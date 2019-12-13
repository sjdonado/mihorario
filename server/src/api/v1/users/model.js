const moment = require('moment');

const ApiError = require('../../../lib/ApiError');
const { request } = require('../../../services/apolloLink');

const {
  USER_QUERY,
  TERMS_QUERY,
  GROUPED_SCHEDULE_QUERY,
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
const pomeloSchedule = async (credentials, startDate) => {
  try {
    const startDateParsed = moment(startDate, 'YYYY-MM-DD').add(2, 'month');
    // const endDateParsed = moment(moment(startDate, 'YYYY-MM-DD').add(7, 'days');
    const year = startDateParsed.year();
    const month = startDateParsed.month();
    const day = startDateParsed.day();
    
    const variables = {
      start: {
        year,
        month,
        day,
      },
      end: {
        year,
        month,
        day: day + 7,
      },
    };
  
    const groupedScheduleResponse = await request(credentials, GROUPED_SCHEDULE_QUERY, variables);
    const data = groupedScheduleResponse.data.groupedSchedule;

    const subjectsByDays = [[], [], [], [], [], [], []];
    data.forEach(({
      courseName,
      sectionId,
      sectionTitle,
      meetings,
    }) => {
      meetings.forEach(({
        buildingId,
        room,
        dates,
      }) => {
        dates.forEach(({ start, end }) => {
          const startDate = moment(start).utcOffset(-5);
          const endDate = moment(end).utcOffset(-5);
          const weekdayParsed = startDate.weekday() - 1 < 0 ? 6 : startDate.weekday() - 1;

          subjectsByDays[weekdayParsed].push({
            nrc: sectionId,
            name: sectionTitle,
            shortName: sectionTitle,
            type: courseName,
            start: startDate.format('hh:mm A'),
            end: endDate.format('hh:mm A'),
            place: `${buildingId} ${room}`,
            startDate: startDate.format('MMM DD, YYYY', 'es'),
            endDate: endDate.format('MMM DD, YYYY', 'es'),
          })
          
        })
      })
    });

    const scheduleByHours = Array.from(Array(14), () => new Array(6));
    subjectsByDays.forEach((day, index) => {
      day.forEach((row) => {
        const startSubjectDate = moment(row.start, 'hh:mm A');
        const endSubjectDate = moment(row.end, 'hh:mm A');

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
