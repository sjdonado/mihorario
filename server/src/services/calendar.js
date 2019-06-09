/**
 * CalendarService
 * @author krthr
 * @author sjdonado
 * @since 1.0.0
 */

const moment = require('moment');
const { google } = require('googleapis');
const { calendar } = require('../config');

const oauth2Client = new google.auth.OAuth2(
  calendar.clientId,
  calendar.secretClient,
  calendar.callback,
);

class CalendarService {
  constructor(tokens) {
    oauth2Client.setCredentials(tokens);
    this.googleCalendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  /**
   * Create a new event
   * @param {*} newEvent
   */
  async createEvent(newEvent) {
    const isAdded = await this.isAdded(newEvent);
    return isAdded ? null : this.googleCalendar.events.insert({ calendarId: 'primary', resource: newEvent });
  }

  /**
   * Verify if the event already exists
   * @param {*} newEvent
   */
  async isAdded(newEvent) {
    const { start, end } = newEvent;
    const eventsList = await this.getEventsAtTimeRange(start.dateTime, end.dateTime);

    return eventsList.length && eventsList.some(event => (
      event.summary === newEvent.summary
      && event.description === newEvent.description
      && event.location === newEvent.location
    ));
  }

  /**
   * Get events at time range
   * @param {Date} start
   * @param {Date} end
   */
  async getEventsAtTimeRange(start, end) {
    return (await this.googleCalendar.events.list({
      calendarId: 'primary',
      timeMin: start,
      timeMax: end,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    })).data.items;
  }
}

module.exports = CalendarService;
