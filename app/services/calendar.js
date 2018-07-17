/**
 * CalendarService
 * @author krthr
 * @since 1.0.0
 */

const gcal = require("google-calendar");
let googleCalendar = new gcal.GoogleCalendar(null);

const createClient = token => {
  googleCalendar = new gcal.GoogleCalendar(token);
};

const createEvent = async newEvent => {
  return new Promise((resolve, reject) => {
    googleCalendar.events.insert("primary", newEvent, {}, (err, event) => {
      console.log(err, event);
    });
  });
};

module.exports = {
  createClient,
  createEvent
};
