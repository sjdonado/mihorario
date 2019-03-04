/**
 * GoogleCalendarController - Create events
 * @author krthr
 * @since 1.0.0
 */

const { reportError } = require("./../services/raven");
const GoogleCalendarRouter = require("express").Router();
const CalendarService = require("./../services/calendarService");
const moment = require("moment");
const colombiaHolidays = require("colombia-holidays");

const colombiaHolidaysArray = colombiaHolidays.getColombiaHolidaysByYear(
  moment().format("YYYY")
);

function holidaysByDate(date) {
  return colombiaHolidaysArray.map(
    holiday =>
      `EXDATE;TZID=America/Bogota:${holiday.celebrationDay
        .split("-")
        .join("")}T${date.split(":").join("")}00`
  );
}

async function createEvent(newEvent, calendarService){
  try {
    const response = await calendarService.createEvent(newEvent)
    if(response.status !== 200){
      await createEvent(newEvent,calendarService);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * [ALL] Add the events to user calendar
 */
GoogleCalendarRouter.all("/create", async (req, res) => {
  try {
    const { subject, tokens, notif_time } = req.body;

    if (!subject) return res.redirect("/subjects");
  
    let subjects = subject;
  
    if (subjects.constructor !== Array) subjects = [subjects];
  
    subjects = subjects.map(el => {
      return JSON.parse(el);
    });
  
    const calendarService = new CalendarService(tokens);
  
    subjects.forEach(async subject => {
      subject.meetingPatterns.forEach(async ev => {
        const newEvent = {
          location: ev.building + ", " + ev.room,
          summary: subject.sectionTitle,
          description: subject.instructors[0].formattedName,
          start: {
            dateTime: moment(
              `${ev.startDate} ${ev.sisStartTimeWTz.substr(0, 5)} GMT-0500`
            )
              .add(ev.daysOfWeek - 2, "days")
              .format(),
            timeZone: "America/Bogota"
          },
          end: {
            dateTime: moment(
              `${ev.startDate} ${ev.sisEndTimeWTz.substr(0, 5)} GMT-0500`
            )
              .add(ev.daysOfWeek - 2, "days")
              .format(),
            timeZone: "America/Bogota"
          },
          reminders: {
            useDefault: false,
            overrides: [
              {
                method: "popup",
                minutes: notif_time || 20
              }
            ]
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;UNTIL=${subject.lastMeetingDate
              .split("-")
              .join("")}`,
            ...holidaysByDate(ev.sisStartTimeWTz.substr(0, 5))
          ]
        };
        await createEvent(newEvent, calendarService);
      });
    });
  
    req.session.done = true;
  
    return res.redirect("/done");
  } catch (e) {
    console.log(e);
  }
});

module.exports = GoogleCalendarRouter;
