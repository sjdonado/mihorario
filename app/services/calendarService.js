/**
 * CalendarService
 * @author krthr
 * @author sjdonado
 * @since 1.0.0
 */

const { google } = require("googleapis");
const { oauth2Client } = require("./authService");

class CalendarService {
  constructor(tokens) {
    oauth2Client.setCredentials(JSON.parse(tokens));
    this.googleCalendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });
  }

  /**
   * Create a new event
   * @param {*} newEvent
   */
  createEvent(newEvent) {
    return this.isAdded(newEvent)
      .then(res => {
        if (!res) {
          return this.googleCalendar.events.insert({
            calendarId: "primary",
            resource: newEvent
          });
        }
      })
      .catch(err => err);
  }

  /**
   * Verify if the event already exists
   * @param {*} newEvent
   */
  async isAdded(newEvent) {
    return this.googleCalendar.events
      .list({
        calendarId: "primary",
        timeMin: newEvent.start.dateTime,
        timeMax: newEvent.end.dateTime,
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime"
      })
      .then(res => {
        const events = res.data.items;
        let added = false;
        if (events.length) {
          added = events.some(event => {
            return (
              event.summary === newEvent.summary &&
              event.description === newEvent.description &&
              event.location === newEvent.location
            );
          });
        }
        return added;
      });
  }
}

module.exports = CalendarService;
