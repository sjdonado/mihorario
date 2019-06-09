/**
 * CalendarService
 * @author krthr
 * @author sjdonado
 * @since 1.0.0
 */

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
  async getCurrentEvent(newEvent) {
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
      const [firstEvent] = eventsList.filter(obj => (
        obj.summary === summary
        && obj.description === description
        && obj.location === location
      ));
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
}

module.exports = CalendarService;

// /**
//  * Calendar service
//  * @author krthr
//  * @author sjdonado
//  * @since 1.0.0
//  */

// const { google } = require('googleapis');
// const { calendar } = require('../config');

// const oauth2Client = new google.auth.OAuth2(
//   calendar.clientId,
//   calendar.secretClient,
//   calendar.callback,
// );

// const getCalendar = async (tokens) => {
//   oauth2Client.setCredentials(tokens);
//   try {
//     await oauth2Client.getTokenInfo(oauth2Client.credentials.access_token);
//   } catch (err) {
//     const data = await new Promise((resolve, reject) => {
//       oauth2Client.getRequestHeaders((refreshAccessTokenErr, newCredentials) => {
//         if (refreshAccessTokenErr) reject(refreshAccessTokenErr);
//         resolve(newCredentials);
//       });
//     });
//     oauth2Client.setCredentials(data);
//   }
//   return google.calendar({ version: 'v3', auth: oauth2Client });
// };

// /**
//  * Get events at time range
//  * @param {Object} googleCalendar
//  * @param {Date} start
//  * @param {Date} end
//  */
// const getEventsAtTimeRange = async (googleCalendar, start, end) => {
//   const events = await googleCalendar.events.list({
//     calendarId: 'primary',
//     timeMin: start,
//     timeMax: end,
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   });
//   return events.data.items;
// };

// /**
//  * Verify if the event already exists
//  * @param {Object} googleCalendar
//  * @param {*} newEvent
//  */
// const isAdded = async (googleCalendar, newEvent) => {
//   const { start, end } = newEvent;
//   const eventsList = await getEventsAtTimeRange(googleCalendar, start.dateTime, end.dateTime);

//   return eventsList.length && eventsList.some(event => (
//     event.summary === newEvent.summary
//     && event.description === newEvent.description
//     && event.location === newEvent.location
//   ));
// };

// /**
//  * Create a new event
//  * @param {Object} googleCalendar
//  * @param {*} newEvent
//  */
// const createEvent = async (googleCalendar, newEvent) => {
//   let data = { err: 'Event already added ' };
//   try {
//     const eventIsAdded = await isAdded(newEvent);
//     if (!eventIsAdded) data = await googleCalendar.events.insert(
// { calendarId: 'primary', resource: newEvent });
//   } catch (err) {
//     data = { err };
//   }
//   return data;
// };

// module.exports = {
//   getEventsAtTimeRange,
//   getCalendar,
//   createEvent,
// };
