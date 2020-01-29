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
   * Get events at time range
   * @param {Date} start
   * @param {Date} end
   */
  async getEventsAtTimeRange(start, end, multi = false) {
    const params = {
      calendarId: 'primary',
      timeMin: start,
      timeMax: end,
    };

    if (!multi) {
      Object.assign(params, {
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
    }
    return (await this.googleCalendar.events.list(params)).data.items;
  }

  /**
   * Create a new event
   * @param {*} newEvent
   */
  async createEvent(newEvent) {
    let data;
    try {
      const currentEvent = await this.searchEvent(newEvent);
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
   * Remove event
   * @param {*} eventId 
   */
  async deleteEvent(eventId) {
    let data;
    try {
      data = await this.googleCalendar.events.delete({
        calendarId: 'primary',
        eventId,
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
  async searchEvent(newEvent, deepMatch = false, multi = false) {
    const {
      start,
      end,
      summary,
      description,
      location,
    } = newEvent;

    const eventsList = await this.getEventsAtTimeRange(start.dateTime, end.dateTime, multi);

    let event = null;
    let events;
    if (eventsList.length > 0) {
      events = eventsList.filter((obj) => {
        if (deepMatch) {
          return obj.summary === summary
            && obj.description === description
            && obj.location === location;
        }
        return obj.summary === summary;
      });
      event = events[0];
    }
    if (multi) return events;

    return event;
  }

  getSyncedScheduleEvents(subjects) {
    return Promise.all(subjects.map(async (subject) => {
      const {
        startDate,
        endDate,
        name,
        instructors,
        place,
      } = subject;
      const event = { googleSynced: false };
      try {
        const currentEvent = await this.searchEvent({
          start: parsePomeloDateToCalendar(startDate, true),
          end: parsePomeloDateToCalendar(endDate, true),
          summary: name,
          description: instructors,
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

  async getAllSyncedEvents(subjects) {
    let events = [];
    for (let { startDate, endDate, name, instructors, place } of subjects) {
      const params = {
        start: parsePomeloDateToCalendar(startDate, true),
        end: parsePomeloDateToCalendar(endDate, true),
        summary: name,
        description: instructors,
        location: place,
      };

      const foundEvents = await this.searchEvent(params, true, true);
      events = events.concat(foundEvents.map(({ id }) => id));
    }
    return events;
  }
}

module.exports = CalendarService;
