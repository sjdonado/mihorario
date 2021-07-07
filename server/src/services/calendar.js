/**
 * CalendarService
 * @author krthr
 * @author sjdonado
 * @since 1.0.0
 */

const { google } = require('googleapis');
const logger = require('../utils/logger');
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

    const events = await this.googleCalendar.events.list(params);

    return events.data.items;
  }

  /**
   * Create a new event
   * @param {*} newEvent
   */
  async createEvent(newEvent) {
    try {
      const currentEvent = await this.searchEvent(newEvent);
      if (currentEvent) {
        return this.googleCalendar.events.update({
          calendarId: 'primary',
          eventId: currentEvent.id,
          resource: Object.assign(currentEvent, newEvent),
        });
      }
      return this.googleCalendar.events.insert({
        calendarId: 'primary',
        resource: newEvent,
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * Remove event
   * @param {*} eventId
   */
  deleteEvent(eventId) {
    try {
      return this.googleCalendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      return { error };
    }
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
      const [foundEvent] = events;
      event = foundEvent;
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
          // logger.info('=> getSyncedScheduleEvents: currentEvent', currentEvent);
          Object.assign(event, {
            googleSynced: event !== null,
            color: colorId,
            notificationTime: reminders.overrides[0].minutes,
          });
        }
      } catch (error) {
        logger.error(error);
      }
      return Object.assign(subject, event);
    }));
  }

  async getAllSyncedEvents(subjects) {
    const events = [];

    await Promise.all(subjects.map(async (subject) => {
      const {
        startDate,
        endDate,
        name,
        instructors,
        place,
      } = subject;
      const params = {
        start: parsePomeloDateToCalendar(startDate, true),
        end: parsePomeloDateToCalendar(endDate, true),
        summary: name,
        description: instructors,
        location: place,
      };

      const foundEvents = await this.searchEvent(params, true, true);
      events.push(...foundEvents.map(({ id }) => ({ subject, eventId: id })));
    }));

    return events;
  }
}

module.exports = CalendarService;
