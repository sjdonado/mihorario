/**
 * CalendarService
 * @author krthr
 * @author sjdonado
 * @since 1.0.0
 */

const { google } = require('googleapis');
const { calendar } = require('../config');
const { parsePomeloDateToCalendar } = require('../lib/Date');

const oauth2Client = new google.auth.OAuth2(
  calendar.clientId,
  calendar.secretClient,
  calendar.callback,
);

class CalendarService {
  constructor(tokens) {
    oauth2Client.setCredentials(tokens);
    // if (oauth2Client.isTokenExpiring()) {
    //   oauth2Client.refreshAccessTokenAsync();
    // }
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
    let data;
    try {
      const currentEvent = await this.getCurrentEvent(newEvent);
      data = currentEvent ? await this.googleCalendar.events.update({
        calendarId: 'primary',
        eventId: currentEvent.id,
        resource: Object.assign(currentEvent, newEvent),
      })
        : await this.googleCalendar.events.insert({
          calendarId: 'primary',
          resource: newEvent,
        });
    } catch (err) {
      data = { err };
    }
    return data;
  }

  /**
   * Verify if the event already exists
   * @param {*} newEvent
   */
  async getCurrentEvent(newEvent, deepMatch = false) {
    const {
      start,
      end,
      summary,
      description,
      location,
    } = newEvent;

    const eventsList = await this.getEventsAtTimeRange(start.dateTime, end.dateTime);

    let currentEvent = null;
    if (eventsList.length > 0) {
      const [firstEvent] = eventsList.filter((obj) => {
        if (deepMatch) {
          return obj.summary === summary
            && obj.description === description
            && obj.location === location;
        }
        return obj.summary === summary;
      });
      currentEvent = firstEvent;
    }
    return currentEvent;
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

  getSyncedScheduleEvents(subjects) {
    // eslint-disable-next-line no-restricted-syntax
    // console.log('=> getSyncedScheduleEvents: SUBJECTS', subjects);
    return Promise.all(subjects.map(async (subject) => {
      // console.log('=> getSyncedScheduleEvents: SUBJECT', subject);
      const {
        startDate,
        finishDate,
        name,
        teacher,
        place,
      } = subject;
      // eslint-disable-next-line no-await-in-loop
      // let googleSynced = false;
      const event = { googleSynced: false };
      try {
        const currentEvent = await this.getCurrentEvent({
          start: parsePomeloDateToCalendar(startDate, true),
          end: parsePomeloDateToCalendar(finishDate, true),
          summary: name,
          description: teacher,
          location: place,
        }, true);
        if (currentEvent) {
          const { colorId, reminders } = currentEvent;
          // console.log('=> getSyncedScheduleEvents: currentEvent', currentEvent);
          Object.assign(event, {
            googleSynced: event !== null,
            color: colorId,
            notificationTime: reminders.overrides[0].minutes,
          });
        }
      } catch (err) {
        console.log('err', err);
      }
      return Object.assign(subject, event);
    }));
  }
}

module.exports = CalendarService;
