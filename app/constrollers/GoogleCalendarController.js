/**
 * GoogleCalendarController - Create events 
 * @author krthr
 * @since 1.0.0
 */

const GoogleCalendarRouter = require("express").Router();
const {
  createEvent
} = require("./../services/calendar");
const moment = require("moment");

/**
 * [ALL] Add the events to user calendar
 */
GoogleCalendarRouter.all("/create", async (req, res) => {
  if (!req.body.subject) return res.redirect("/subjects");

  let subjects = req.body.subject;
  if (subjects.constructor !== Array) subjects = [subjects]

  subjects = subjects.map(el => {
    return JSON.parse(el);
  });

  const subject = subjects[0];

  subjects.forEach(subject => {
    subject.meetingPatterns.forEach(ev => {
      const newEvent = {
        location: ev.building + ', ' + ev.room,
        summary: subject.sectionTitle,
        description: subject.instructors[0].formattedName,
        start: {
          dateTime: moment(ev.startDate + " " + ev.startTime)
            .add(ev.daysOfWeek - 2, "days")
            .format(),
          timeZone: "America/Bogota"
        },
        end: {
          dateTime: moment(ev.startDate + " " + ev.endTime)
            .add(ev.daysOfWeek - 2, "days")
            .format(),
          timeZone: "America/Bogota"
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=${subject.lastMeetingDate
            .split("-")
            .join("")}`
        ]
      };

      // console.log(newEvent);
      createEvent(newEvent);
    });
  });

  return res.redirect('/done');
});

module.exports = GoogleCalendarRouter;
