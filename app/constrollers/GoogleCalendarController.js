/**
 * GoogleCalendarController - Create events
 * @author krthr
 * @since 1.0.0
 */

const { reportError } = require("./../services/raven");
const GoogleCalendarRouter = require("express").Router();
const { createEvent } = require("./../services/calendar");
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

/**
 * [ALL] Add the events to user calendar
 */
GoogleCalendarRouter.all("/create", async (req, res) => {
  if (!req.body.subject) return res.redirect("/subjects");

  let subjects = req.body.subject;

  if (subjects.constructor !== Array) subjects = [subjects];

  subjects = subjects.map(el => {
    return JSON.parse(el);
  });

  subjects.forEach(subject => {
    subject.meetingPatterns.forEach(ev => {
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
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=${subject.lastMeetingDate
            .split("-")
            .join("")}`,
          ...holidaysByDate(ev.sisStartTimeWTz.substr(0, 5))
        ]
      };
      createEvent(newEvent).catch(e => reportError(e, newEvent));
    });
  });

  return res.redirect("/done");
});

module.exports = GoogleCalendarRouter;
