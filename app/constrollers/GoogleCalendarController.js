/**
 * GoogleCalendarController - Create events
 * @author krthr
 * @since 1.0.0
 */

const { reportError } = require("./../services/raven");
const GoogleCalendarRouter = require("express").Router();
const { createEvent } = require("./../services/calendar");
const moment = require("moment");

/**
 * [ALL] Add the events to user calendar
 */
GoogleCalendarRouter.all("/create", async (req, res) => {
  if (!req.body.subject) return res.redirect("/subjects");

  let subjects = req.body.subject;
  let reminder_minutes =
    req.body.reminder && req.body.reminder >= 0 ? req.body.reminder : 30;

  if (subjects.constructor !== Array) subjects = [subjects];

  subjects = subjects.map(el => {
    return JSON.parse(el);
  });

  const subject = subjects[0];

  console.log(reminder_minutes);

  subjects.forEach(subject => {
    subject.meetingPatterns.forEach(ev => {
      const newEvent = {
        location: ev.building + ", " + ev.room,
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
        ],
        reminders: {
          useDefault: false,
          overrides: [
            {
              method: "popup",
              minutes: reminder_minutes
            }
          ]
        }
      };

      // console.log(newEvent);
      createEvent(newEvent).catch(e => reportError(e, newEvent));
    });
  });

  return res.redirect("/done");
});

module.exports = GoogleCalendarRouter;
