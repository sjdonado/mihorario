const moment = require('moment');
const CalendarService = require('../../../services/calendar');

const getWeekEvents = (tokens) => {
  const calendarService = new CalendarService(tokens);
  const start = moment().subtract(7, 'days').startOf('day').format();
  const end = moment().add(1, 'days').endOf('day').format();
  return calendarService.getEventsAtTimeRange(start, end);
};

const importSchedule = (tokens, schedule, notificationTime = 20) => {
  const calendarService = new CalendarService(tokens);
  const events = schedule.map(async (day, idx) => day.map(subject => calendarService.createEvent({
    location: subject.place,
    summary: subject.name,
    description: subject.teacher,
    start: {
      dateTime: moment(`${subject.startDate} ${subject.start}`, 'MMM DD, YYYY hh:mm A', 'es').add(idx, 'days').format(),
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: moment(`${subject.startDate} ${subject.finish}`, 'MMM DD, YYYY hh:mm A', 'es').add(idx, 'days').format(),
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
    recurrence: [
      `RRULE:FREQ=WEEKLY;UNTIL=${moment(subject.finishDate, 'MMM DD, YYYY', 'es').format('YYYYMMDD')}`,
      // ...holidaysByDate(ev.sisStartTimeWTz.substr(0, 5))
    ],
  }))).filter(event => event);
  return Promise.all(events);
};

module.exports = {
  getWeekEvents,
  importSchedule,
};
