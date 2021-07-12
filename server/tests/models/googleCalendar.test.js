const { google } = require('googleapis');
const model = require('../../src/api/v1/googleCalendar/model');

jest.mock('googleapis');

const CALENDAR_EVENTS_RESPONSE = [
  {
    eventId: 1,
    location: 'SPACE VIRT',
    summary: 'MATEMATICAS DISCRETAS AVANZADA',
    description: 'Gutierrez Garcia, Ismael',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T13:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T16:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190316',
    ],
    colorId: 2,
  },
  {
    eventId: 2,
    location: 'SPACE VIRT',
    summary: 'MATEMATICAS DISCRETAS AVANZADA',
    description: 'Gutierrez Garcia, Ismael',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T13:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T16:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190316',
    ],
    colorId: 2,
  },
  {
    eventId: 3,
    location: 'SPACE VIRT',
    summary: 'MATEMATICAS DISCRETAS AVANZADA',
    description: 'Gutierrez Garcia, Ismael',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T13:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-25T16:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190316',
    ],
    colorId: 2,
  },
  {
    eventId: 4,
    location: 'SPACE VIRT',
    summary: 'INTELIGENCIA ARTIFICIAL',
    description: 'Zurek Varela, Eduardo E.',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-26T16:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-26T19:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190324',
    ],
    colorId: 3,
  },
  {
    eventId: 5,
    location: 'SPACE VIRT',
    summary: 'INTELIGENCIA ARTIFICIAL',
    description: 'Zurek Varela, Eduardo E.',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-26T16:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-26T19:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190324',
    ],
    colorId: 3,
  },
  {
    eventId: 6,
    location: 'SPACE VIRT',
    summary: 'INGENIERIA DE REDES Y CONEC I',
    description: 'Jabba Molinares, Daladier',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-28T16:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-28T19:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190326',
    ],
    colorId: 4,
  },
  {
    eventId: 7,
    location: 'SPACE VIRT',
    summary: 'INGENIERIA DE REDES Y CONEC I',
    description: 'Jabba Molinares, Daladier',
    start: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-28T16:30:00-05:00',
    },
    end: {
      timeZone: 'America/Bogota',
      dateTime: '2019-01-28T19:27:00-05:00',
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 15,
        },
      ],
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;UNTIL=20190326',
    ],
    colorId: 4,
  },
];

const CALENDAR_INSERT_EVENT = {
  eventId: 8,
  location: 'SPACE VIRT',
  summary: 'INVESTIGACION 2',
  description: 'Niño Ruiz, Elias D.',
  start: {
    timeZone: 'America/Bogota',
    dateTime: '2019-01-31T06:30:00-05:00',
  },
  end: {
    timeZone: 'America/Bogota',
    dateTime: '2019-01-31T07:29:00-05:00',
  },
  reminders: {
    useDefault: false,
    overrides: [
      {
        method: 'popup',
        minutes: 15,
      },
    ],
  },
  recurrence: [
    'RRULE:FREQ=WEEKLY;UNTIL=20190520',
  ],
  colorId: 1,
};

const CALENDAR_INVALID_SUBJECT = {
  eventId: null,
};

google.calendar.mockImplementation(() => ({
  events: {
    update: () => ({
      data: null,
    }),
    insert: ({ resource }) => {
      if (!resource.eventId) {
        throw new Error('EventId is null');
      }
      CALENDAR_EVENTS_RESPONSE.push(CALENDAR_INSERT_EVENT);
      return CALENDAR_INSERT_EVENT;
    },
    list: () => ({
      data: { items: CALENDAR_EVENTS_RESPONSE },
    }),
    delete: ({ eventId }) => {
      if (!eventId) {
        throw new Error('EventId is null');
      }
      CALENDAR_EVENTS_RESPONSE.map((subject) => subject.eventId !== eventId);
      return CALENDAR_EVENTS_RESPONSE.findOne((elem) => elem.eventId === eventId);
    },
  },
}));

const SUBJECTS = [
  {
    nrc: '9621',
    name: 'MATEMATICAS DISCRETAS AVANZADA',
    shortName: 'MATEMATICAS DISCRETAS AVANZADA',
    instructors: 'Gutierrez Garcia, Ismael',
    type: 'IST 42007',
    place: 'SPACE VIRT',
    startDate: 'Jan 25, 2019',
    endDate: 'Mar 16, 2019',
    startTime: '01:30 PM',
    endTime: '04:27 PM',
    color: {
      id: 2,
      background: '#7ae7bf',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 2,
  },
  {
    nrc: '9621',
    name: 'MATEMATICAS DISCRETAS AVANZADA',
    shortName: 'MATEMATICAS DISCRETAS AVANZADA',
    instructors: 'Gutierrez Garcia, Ismael',
    type: 'IST 42007',
    place: 'SPACE VIRT',
    startDate: 'Apr 05, 2019',
    endDate: 'May 11, 2019',
    startTime: '01:30 PM',
    endTime: '04:27 PM',
    color: {
      id: 2,
      background: '#7ae7bf',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 2,
  },
  {
    nrc: '9621',
    name: 'MATEMATICAS DISCRETAS AVANZADA',
    shortName: 'MATEMATICAS DISCRETAS AVANZADA',
    instructors: 'Gutierrez Garcia, Ismael',
    type: 'IST 42007',
    place: 'SPACE VIRT',
    startDate: 'May 18, 2019',
    endDate: 'Jun 01, 2019',
    startTime: '01:30 PM',
    endTime: '04:27 PM',
    color: {
      id: 2,
      background: '#7ae7bf',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 2,
  },
  {
    nrc: '9626',
    name: 'INTELIGENCIA ARTIFICIAL',
    shortName: 'INTELIGENCIA ARTIFICIAL',
    instructors: 'Zurek Varela, Eduardo E.',
    type: 'IST 62008',
    place: 'SPACE VIRT',
    startDate: 'Jan 25, 2019',
    endDate: 'Mar 24, 2019',
    startTime: '04:30 PM',
    endTime: '07:27 PM',
    color: {
      id: 3,
      background: '#dbadff',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 3,
  },
  {
    nrc: '9626',
    name: 'INTELIGENCIA ARTIFICIAL',
    shortName: 'INTELIGENCIA ARTIFICIAL',
    instructors: 'Zurek Varela, Eduardo E.',
    type: 'IST 62008',
    place: 'SPACE VIRT',
    startDate: 'Apr 06, 2019',
    endDate: 'May 18, 2019',
    startTime: '04:30 PM',
    endTime: '07:27 PM',
    color: {
      id: 3,
      background: '#dbadff',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 3,
  },
  {
    nrc: '9639',
    name: 'INGENIERIA DE REDES Y CONEC I',
    shortName: 'INGENIERIA DE REDES Y CONEC I',
    instructors: 'Jabba Molinares, Daladier',
    type: 'IST 62018',
    place: 'SPACE VIRT',
    startDate: 'Jan 25, 2019',
    endDate: 'Mar 26, 2019',
    startTime: '04:30 PM',
    endTime: '07:27 PM',
    color: {
      id: 4,
      background: '#ff887c',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 4,
  },
  {
    nrc: '9639',
    name: 'INGENIERIA DE REDES Y CONEC I',
    shortName: 'INGENIERIA DE REDES Y CONEC I',
    instructors: 'Jabba Molinares, Daladier',
    type: 'IST 62018',
    place: 'SPACE VIRT',
    startDate: 'Apr 07, 2019',
    endDate: 'May 20, 2019',
    startTime: '04:30 PM',
    endTime: '07:27 PM',
    color: {
      id: 4,
      background: '#ff887c',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 4,
  },
  {
    nrc: '9548',
    name: 'INVESTIGACION 2',
    shortName: 'INVESTIGACION 2',
    instructors: 'Niño Ruiz, Elias D.',
    type: 'INV 42028',
    place: 'SPACE VIRT',
    startDate: 'Jan 25, 2019',
    endDate: 'May 20, 2019',
    startTime: '06:30 AM',
    endTime: '07:29 AM',
    color: {
      id: 1,
      background: '#a4bdfc',
      foreground: '#1d1d1d',
    },
    notificationTime: 15,
    googleSynced: false,
    colorId: 1,
  },
];

const TOKENS = {
  access_token: 'ACCESS_TOKEN',
  refresh_token: 'REFRESH_TOKEN',
};

describe('Test GoogleCalendar model', () => {
  it('Should import schedule', async () => {
    const subjectsMatrix = [
      SUBJECTS.slice(0, 3),
      SUBJECTS.slice(3, 5),
      [],
      SUBJECTS.slice(5, 7),
      [],
      [],
      SUBJECTS.slice(-1),
    ];

    const events = await model.importSchedule(TOKENS, subjectsMatrix);

    expect(events[0].data.subject).toEqual(subjectsMatrix[0][0]);
    expect(events[1].data.subject).toEqual(subjectsMatrix[0][1]);
    expect(events[2].data.subject).toEqual(subjectsMatrix[0][2]);

    expect(events[3].data.subject).toEqual(subjectsMatrix[1][0]);
    expect(events[4].data.subject).toEqual(subjectsMatrix[1][1]);

    expect(events[5].data.subject).toEqual(subjectsMatrix[3][0]);
    expect(events[6].data.subject).toEqual(subjectsMatrix[3][1]);

    expect(events[7].data.subject).toEqual(subjectsMatrix[6][0]);
  });

  it('Should import schedule with an eventId error', async () => {
    const subjectsMatrix = [
      SUBJECTS.slice(0, 3),
      SUBJECTS.slice(3, 5),
      [],
      SUBJECTS.slice(5, 7),
      [],
      [CALENDAR_INVALID_SUBJECT],
      SUBJECTS.slice(-1),
    ];

    const events = await model.importSchedule(TOKENS, subjectsMatrix);
    expect(events[7].error.message).toEqual('EventId is null');
  });

  it('Should get synced subjects', async () => {
    const events = await model.getSyncedSubjects(TOKENS, SUBJECTS);

    expect(events[0].nrc).toEqual(SUBJECTS[0].nrc);
    expect(events[1].nrc).toEqual(SUBJECTS[1].nrc);
    expect(events[2].nrc).toEqual(SUBJECTS[2].nrc);
    expect(events[3].nrc).toEqual(SUBJECTS[3].nrc);
    expect(events[4].nrc).toEqual(SUBJECTS[4].nrc);
    expect(events[5].nrc).toEqual(SUBJECTS[5].nrc);
    expect(events[6].nrc).toEqual(SUBJECTS[6].nrc);
    expect(events[7].nrc).toEqual(SUBJECTS[7].nrc);
  });

  it('Should remove subject', async () => {
    const removeSubjects = SUBJECTS.slice(0, 2);
    const subjects = await model.removeSubjects(TOKENS, removeSubjects);

    expect(subjects[0].googleSynced).toBe(false);
    expect(subjects[1].googleSynced).toBe(false);
  });
});
