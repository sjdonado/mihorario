const moment = require('moment');
const ApiError = require('../../../lib/ApiError');
const { parsePomeloDateToCalendar } = require('../../../lib/Date');

const CalendarService = require('../../../services/calendar');

/**
 * Get range of dates
 * @param {Object} start
 * @param {Object} end
 * @param {String} key
 */
const getRangeOfDates = (start, end, key, arr = [start.startOf(key)]) => {
  if (start.isAfter(end)) throw new ApiError(`Start must precede end => ${start}-${end}`);
  const next = moment(start).add(1, key).startOf(key);
  if (next.isAfter(end, key)) return arr;
  return getRangeOfDates(next, end, key, arr.concat(next));
};

const getSyncedSubjects = async (tokens, subjects) => {
  const calendarService = new CalendarService(tokens);
  return calendarService.getSyncedScheduleEvents(subjects);
};

/**
 * Import Pomelo schedule to Google calendar
 * @param {Object} tokens
 * @param {Object} tokens.access_token
 * @param {Object} tokens.refresh_token
 * @param {Object[][]} subjectsMatrix
 */
const importSchedule = async (tokens, subjectsMatrix) => {
  const calendarService = new CalendarService(tokens);
  const events = [];
  /**
  * With the Promise.all implementation some request are executing at same time causing a server
  * error response.
  * Use for loops avoid this problem.
  */
  // eslint-disable-next-line no-restricted-syntax
  for (const [dayNumber, day] of subjectsMatrix.entries()) {
    // eslint-disable-next-line no-restricted-syntax
    for (const subject of day) {
      // Verify if is already synced
      if (!subject.googleSynced) {
        // Calendar day   ---  dayNumber
        // S M T W T F S  ---  S M T W T F S
        // 1 2 3 4 5 6 7  ---  6 0 1 2 3 4 5
        const startDate = moment(subject.startDate);
        const endDate = moment(subject.endDate);

        const firstWeekDay = moment(subject.startDate).startOf('week').add(1, 'day');
        const invalidDays = startDate.weekday() - 1 === 0 ? [] : getRangeOfDates(firstWeekDay.clone(), startDate.clone().subtract(1, 'day'), 'days');

        // First classes day doesn't start on first week day offset
        if (invalidDays.some(date => date.format('YYYYMMDD') === firstWeekDay.clone().add(dayNumber, 'days').format('YYYYMMDD'))) {
          firstWeekDay.add(1, 'weeks');
        }

        const startDateTime = moment(`${firstWeekDay.format('YYYYMMDD')} ${subject.startTime} -05:00`, 'YYYYMMDD hh:mm A Z');
        const endDateTime = moment(`${firstWeekDay.format('YYYYMMDD')} ${subject.endTime} -05:00`, 'YYYYMMDD hh:mm A Z');

        const recurrence = [];
        // On day classes verification
        if (startDate.format('YYYYMMDD') !== endDate.format('YYYYMMDD')) {
          recurrence.push(`RRULE:FREQ=WEEKLY;UNTIL=${endDate.format('YYYYMMDD')}`);
          // `EXDATE;TZID=America/Bogota:${date.format('YYYYMMDD')}`
        }

        const calendarEventData = {
          location: subject.place,
          summary: subject.name,
          description: subject.instructors,
          start: parsePomeloDateToCalendar(startDateTime.add(dayNumber, 'days')),
          end: parsePomeloDateToCalendar(endDateTime.add(dayNumber, 'days')),
          reminders: {
            useDefault: false,
            overrides: [
              {
                method: 'popup',
                minutes: subject.notificationTime,
              },
            ],
          },
          recurrence,
        };

        if (subject.colorId !== 0) Object.assign(calendarEventData, { colorId: subject.colorId });

        // eslint-disable-next-line no-await-in-loop
        const calendarEvent = await calendarService.createEvent(calendarEventData);
        events.push(Object.assign(calendarEvent, { data: { subject } }));
      }
    }
  }
  return events;
};

/**
 * Remove Pomelo subjects from Google calendar
 * @param {Object} tokens
 * @param {Object} tokens.access_token
 * @param {Object} tokens.refresh_token
 * @param {Object[]} subjects
 */
const removeSubjects = async (tokens, subjects) => {
  const calendarService = new CalendarService(tokens);

  const allSyncedEvents = await calendarService.getAllSyncedEvents(subjects);
  await Promise.all(allSyncedEvents.map(eventId => calendarService.deleteEvent(eventId)));

  return subjects.map(subject => Object.assign(subject, { googleSynced: false }));
};

module.exports = {
  getSyncedSubjects,
  importSchedule,
  removeSubjects,
};
