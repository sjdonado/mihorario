const moment = require('moment');
const ApiError = require('../../../lib/ApiError');

const CalendarService = require('../../../services/calendar');

/**
 * Get range of dates
 * @param {Object} start
 * @param {Object} end
 * @param {String} key
 */
const getRangeOfDates = (start, end, key, arr = [start.startOf(key)]) => {
  if (start.isAfter(end)) throw new ApiError('Start must precede end');
  const next = moment(start).add(1, key).startOf(key);
  if (next.isAfter(end, key)) return arr;
  return getRangeOfDates(next, end, key, arr.concat(next));
};

const getWeekEvents = (tokens) => {
  const calendarService = new CalendarService(tokens);
  const start = moment().subtract(7, 'days').startOf('day').format();
  const end = moment().add(1, 'days').endOf('day').format();
  return calendarService.getEventsAtTimeRange(start, end);
};

/**
 * Import Pomelo schedule to Google calendar
 * @param {Object} tokens
 * @param {Object} tokens.access_token
 * @param {Object} tokens.refresh_token
 * @param {*} schedule
 * @param {Int} notificationTime
 */
const importSchedule = async (tokens, subjectsByDays, notificationTime = 20) => {
  const calendarService = new CalendarService(tokens);
  const events = [];
  /**
  * With the Promise.all implementation some request are executing at same time causing a server
  * error response.
  * Use for loops avoid this problem.
  */
  // eslint-disable-next-line no-restricted-syntax
  for (const [dayNumber, day] of subjectsByDays.entries()) {
    // eslint-disable-next-line no-restricted-syntax
    for (const subject of day) {
      // Calendar day   ---  dayNumber
      // S M T W T F S  ---  S M T W T F S
      // 1 2 3 4 5 6 7  ---  6 0 1 2 3 4 5
      const startDate = moment(`${subject.startDate}`, 'MMM DD, YYYY', 'es');
      const finishDate = moment(`${subject.finishDate}`, 'MMM DD, YYYY', 'es');

      const firstWeekDay = moment(subject.startDate, 'MMM DD, YYYY', 'es').startOf('week');
      const invalidDays = getRangeOfDates(firstWeekDay.clone(), startDate.clone().subtract(1, 'days'), 'days');

      // First classes day doesn't start on first week day offset
      if (invalidDays.some(date => date.format('YYYYMMDD') === firstWeekDay.clone().add(dayNumber, 'days').format('YYYYMMDD'))) firstWeekDay.add(1, 'weeks');

      const startDateTime = moment(`${firstWeekDay.format('DD-MM-YYYY')} ${subject.start} -05:00`, 'DD-MM-YYYY hh:mm A Z', 'es');
      const endDateTime = moment(`${firstWeekDay.format('DD-MM-YYYY')} ${subject.finish} -05:00`, 'DD-MM-YYYY hh:mm A Z', 'es');

      const recurrence = [];
      // On day classes verification
      if (startDate.format('YYYYMMDD') !== finishDate.format('YYYYMMDD')) {
        recurrence.push(`RRULE:FREQ=WEEKLY;UNTIL=${finishDate.format('YYYYMMDD')}`);
        // `EXDATE;TZID=America/Bogota:${date.format('YYYYMMDD')}`
      }

      // eslint-disable-next-line no-await-in-loop
      events.push(await calendarService.createEvent({
        location: subject.place,
        summary: subject.name,
        description: subject.teacher,
        start: {
          dateTime: startDateTime.add(dayNumber, 'days').utcOffset('-05:00').format(),
          timeZone: 'America/Bogota',
        },
        end: {
          dateTime: endDateTime.add(dayNumber, 'days').utcOffset('-05:00').format(),
          timeZone: 'America/Bogota',
        },
        reminders: {
          useDefault: false,
          overrides: [
            {
              method: 'popup',
              minutes: notificationTime,
            },
          ],
        },
        recurrence,
      }));
    }
  }
  return events;
};

module.exports = {
  getWeekEvents,
  importSchedule,
};
