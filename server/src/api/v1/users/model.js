const moment = require('moment');

const PomeloService = require('../../../services/pomelo');

/**
 * Get pomelo userId
 * @param {{ username: String, password: String }} credentials
 */
const pomeloUserId = (credentials) => {
  const client = new PomeloService(credentials);
  return client.getUserId();
};

/**
 * Get pomelo schedule terms
 * @param {{ username: String, password: String }} credentials
 * @param {String} userId
 */
const pomeloScheduleTerms = async (credentials, userId) => {
  const client = new PomeloService(credentials);
  return client.getFullNameAndTerms(userId);
};

/**
 * Get pomelo schedule
 * @param {{ username: String, password: String }} credentials
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (credentials, userId, termId) => {
  const client = new PomeloService(credentials);
  const data = await client.getSchedule(userId, termId);

  const subjectsByDays = [[], [], [], [], [], [], []];
  data.forEach(({
    courseName,
    sectionId,
    sectionTitle,
    instructors,
    meetingPatterns,
  }) => {
    meetingPatterns.forEach(({
      buildingId,
      room,
      startDate,
      endDate,
      daysOfWeek,
      sisStartTimeWTz,
      sisEndTimeWTz,
    }) => {
      const parsedStartTime = moment.parseZone(sisStartTimeWTz, 'HH:mm');
      const parsedEndTime = moment(sisEndTimeWTz, 'HH:mm');
      const startDateParsed = moment(startDate);
      const endDateParsed = moment(endDate);
      const weekdayParsed = (daysOfWeek[0] + 5) % 7;

      if (startDateParsed.month() !== endDateParsed.month()) {
        subjectsByDays[weekdayParsed].push({
          nrc: sectionId,
          name: sectionTitle,
          shortName: sectionTitle,
          instructors: instructors.map(({ formattedName }) => formattedName).join(','),
          type: courseName,
          place: `${buildingId} ${room}`,
          startDate: startDateParsed.format('MMM DD, YYYY', 'es'),
          endDate: endDateParsed.format('MMM DD, YYYY', 'es'),
          startTime: parsedStartTime.format('hh:mm A'),
          endTime: parsedEndTime.format('hh:mm A'),
        });
      }
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
        scheduleByHours[startSubjectInt - 6][index] = {
          ...row,
          startParsedTime: `${startSubjectInt}:${startSubjectDate.minutes()}`,
          endParsedTime: `${startSubjectInt + 1}:${endSubjectDate.minutes()}`,
          startDate: row.startDate,
          endDate: row.endDate,
        };
        startSubjectInt += 1;
      }
    });
  });

  return { scheduleByHours, subjectsByDays };
};

module.exports = {
  pomeloUserId,
  pomeloScheduleTerms,
  pomeloSchedule,
};
