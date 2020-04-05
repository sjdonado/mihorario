const moment = require('moment');
const Uninorte = require('uninorte-cli');

const ApiError = require('../../../lib/ApiError');

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (username, password) => {
  try {
    const client = await Uninorte(username, password);

    const { name } = await client.user;
    const terms = (await client.terms).map(({ id, name, startDate, endDate }) => ({ id, name, startDate, endDate }));

    return { fullName: name, terms };
  } catch (err) {
    console.log(err);
    throw new ApiError('Invalid credentials', 400);
  }
};

/**
 * Get Pomelo schedule
 * @param {String} username
 * @param {String} password
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (username, password, termId) => {
  try {
    const client = await Uninorte(username, password);
    const data = await client.schedule(termId);

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
        dates.forEach(({ start, end, startTime, endTime }) => {
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
        })
      })
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
    console.log(err);
    throw new ApiError(err);
  }
};

module.exports = {
  pomeloSchedule,
  pomeloSchedulePeriods,
};