const model = require('../../src/api/v1/users/model');
const config = require('../../src/config');

const USER_ID = '200000000';
const USER_FULL_NAME = 'Tester full name';
const TERM_ID = '202910';
const CREDENTIALS = {
  email: 'tester@uninorte.edu.co',
  password: '12345',
};

describe('Test Users model', () => {
  afterEach(() => {
    global.axiosMock.resetHistory();
  });

  it('Should get pomelo userId', async () => {
    const response = {
      status: 'success',
      userId: USER_ID,
      authId: 'tester',
      roles: [
        'EGRESADO',
        'STUDENT',
        'student',
      ],
    };
    global.axiosMock.onGet().replyOnce(200, response);

    const userId = await model.pomeloUserId(CREDENTIALS);

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
    expect(userId).toEqual(response.userId);
  });

  it('Should return error on get pomelo userId with wrong credentials', async () => {
    global.axiosMock.onGet().replyOnce(401, null);

    const wrongCredentials = {
      username: '',
      password: '',
    };

    await expect(model.pomeloUserId(wrongCredentials)).rejects.toThrow('Failed to get userId');

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
  });

  it('Should get pomelo schedule terms', async () => {
    const response = {
      person: {
        id: USER_ID,
        name: USER_FULL_NAME,
      },
      terms: [
        {
          id: '202110',
          name: 'Primer semestre 2021',
          startDate: '2021-01-01',
          endDate: '2021-06-30',
        },
        {
          id: '202030',
          name: 'Segundo semestre 2020',
          startDate: '2020-07-01',
          endDate: '2020-12-30',
        },
        {
          id: '202010',
          name: 'Primer semestre 2020',
          startDate: '2020-01-01',
          endDate: '2020-06-30',
        },
        {
          id: '201930',
          name: 'Segundo semestre 2019',
          startDate: '2019-07-01',
          endDate: '2019-12-30',
        },
        {
          id: '201910',
          name: 'Primer semestre 2019',
          startDate: '2019-01-01',
          endDate: '2019-05-31',
        },
      ],
    };
    global.axiosMock.onGet().replyOnce(200, response);

    const { fullName, terms } = await model.pomeloScheduleTerms(CREDENTIALS, USER_ID);

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
    expect(fullName).toEqual(response.person.name);
    expect(terms).toEqual(response.terms);
  });

  it('Should return error on get pomelo schedule terms with wrong credentials', async () => {
    global.axiosMock.onGet().replyOnce(401, null);

    const wrongCredentials = {
      username: '',
      password: '',
    };

    await expect(model.pomeloScheduleTerms(wrongCredentials, USER_ID)).rejects.toThrow('Failed to get user fullName and terms');

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
  });

  it('Should get pomelo schedule', async () => {
    const response = {
      person: {
        id: USER_ID,
        name: USER_FULL_NAME,
      },
      terms: [
        {
          id: '201910',
          name: 'Primer semestre 2019',
          startDate: '2019-01-01',
          endDate: '2019-06-30',
          sections: [
            {
              sectionId: '9639',
              sectionTitle: 'INGENIERIA DE REDES Y CONEC I',
              courseName: 'IST 62018',
              courseDescription: 'INGENIERIA DE REDES Y CONEC I',
              courseSectionNumber: '01',
              firstMeetingDate: '2019-01-01',
              lastMeetingDate: '2019-06-30',
              credits: 4.0,
              ceus: undefined,
              instructors: [
                {
                  firstName: 'Daladier',
                  lastName: 'Jabba Molinares',
                  middleInitial: undefined,
                  instructorId: '8534748',
                  primary: 'true',
                  formattedName: 'Jabba Molinares, Daladier',
                },
              ],
              learningProvider: undefined,
              learningProviderSiteId: undefined,
              primarySectionId: undefined,
              meetingPatterns: [
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-01-25',
                  endDate: '2019-03-26',
                  startTime: '21:30Z',
                  endTime: '00:27Z',
                  daysOfWeek: [5],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '16:30 America/Bogota',
                  sisEndTimeWTz: '19:27 America/Bogota',
                },
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-04-07',
                  endDate: '2019-05-20',
                  startTime: '21:30Z',
                  endTime: '00:27Z',
                  daysOfWeek: [5],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '16:30 America/Bogota',
                  sisEndTimeWTz: '19:27 America/Bogota',
                },
              ],
              isInstructor: false,
              location: 'P',
              academicLevels: ['PG'],
            },
            {
              sectionId: '9626',
              sectionTitle: 'INTELIGENCIA ARTIFICIAL',
              courseName: 'IST 62008',
              courseDescription: 'INTELIGENCIA ARTIFICIAL',
              courseSectionNumber: '01',
              firstMeetingDate: '2019-01-01',
              lastMeetingDate: '2019-06-30',
              credits: 4.0,
              ceus: undefined,
              instructors: [
                {
                  firstName: 'Eduardo',
                  lastName: 'Zurek Varela',
                  middleInitial: 'Enrique',
                  instructorId: '72167852',
                  primary: 'true',
                  formattedName: 'Zurek Varela, Eduardo E.',
                },
              ],
              learningProvider: undefined,
              learningProviderSiteId: undefined,
              primarySectionId: undefined,
              meetingPatterns: [
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-01-25',
                  endDate: '2019-03-24',
                  startTime: '21:30Z',
                  endTime: '00:27Z',
                  daysOfWeek: [3],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '16:30 America/Bogota',
                  sisEndTimeWTz: '19:27 America/Bogota',
                },
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-04-06',
                  endDate: '2019-05-18',
                  startTime: '21:30Z',
                  endTime: '00:27Z',
                  daysOfWeek: [3],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '16:30 America/Bogota',
                  sisEndTimeWTz: '19:27 America/Bogota',
                },
              ],
              isInstructor: false,
              location: 'P',
              academicLevels: ['PG'],
            },
            {
              sectionId: '9548',
              sectionTitle: 'INVESTIGACION 2',
              courseName: 'INV 42028',
              courseDescription: 'INVESTIGACION 2',
              courseSectionNumber: '06',
              firstMeetingDate: '2019-01-01',
              lastMeetingDate: '2019-06-30',
              credits: 2.0,
              ceus: undefined,
              instructors: [
                {
                  firstName: 'Elias',
                  lastName: 'Niño Ruiz',
                  middleInitial: 'David',
                  instructorId: '72291764',
                  primary: 'true',
                  formattedName: 'Niño Ruiz, Elias D.',
                },
              ],
              learningProvider: undefined,
              learningProviderSiteId: undefined,
              primarySectionId: undefined,
              meetingPatterns: [
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-01-25',
                  endDate: '2019-05-20',
                  startTime: '11:30Z',
                  endTime: '12:29Z',
                  daysOfWeek: [1],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '06:30 America/Bogota',
                  sisEndTimeWTz: '07:29 America/Bogota',
                },
              ],
              isInstructor: false,
              location: 'P',
              academicLevels: ['PG'],
            },
            {
              sectionId: '9621',
              sectionTitle: 'MATEMATICAS DISCRETAS AVANZADA',
              courseName: 'IST 42007',
              courseDescription: 'MATEMATICAS DISCRETAS AVANZADA',
              courseSectionNumber: '01',
              firstMeetingDate: '2019-01-01',
              lastMeetingDate: '2019-06-30',
              credits: 4.0,
              ceus: undefined,
              instructors: [
                {
                  firstName: 'Ismael',
                  lastName: 'Gutierrez Garcia',
                  middleInitial: undefined,
                  instructorId: '19516086',
                  primary: 'true',
                  formattedName: 'Gutierrez Garcia, Ismael',
                },
              ],
              learningProvider: undefined,
              learningProviderSiteId: undefined,
              primarySectionId: undefined,
              meetingPatterns: [
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-01-25',
                  endDate: '2019-03-16',
                  startTime: '18:30Z',
                  endTime: '21:27Z',
                  daysOfWeek: [2],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '13:30 America/Bogota',
                  sisEndTimeWTz: '16:27 America/Bogota',
                },
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-04-05',
                  endDate: '2019-05-11',
                  startTime: '18:30Z',
                  endTime: '21:27Z',
                  daysOfWeek: [2],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '13:30 America/Bogota',
                  sisEndTimeWTz: '16:27 America/Bogota',
                },
                {
                  instructionalMethodCode: undefined,
                  startDate: '2019-05-18',
                  endDate: '2019-06-01',
                  startTime: '18:30Z',
                  endTime: '21:27Z',
                  daysOfWeek: [2],
                  room: 'VIRT',
                  building: 'Bloque Administrativo',
                  buildingId: 'SPACE',
                  campus: 'Campus Principal',
                  campusId: 'P',
                  sisStartTimeWTz: '13:30 America/Bogota',
                  sisEndTimeWTz: '16:27 America/Bogota',
                },
              ],
              isInstructor: false,
              location: 'P',
              academicLevels: ['PG'],
            },
          ],
        },
      ],
    };

    const methodResponse = {
      scheduleByHours: [
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {
            nrc: '9548',
            name: 'INVESTIGACION 2',
            shortName: 'INVESTIGACION 2',
            instructors: '[object Object]',
            type: 'INV 42028',
            place: 'SPACE VIRT',
            startDate: '2019-01-25T05:00:00.000Z',
            endDate: '2019-05-20T05:00:00.000Z',
            startTime: '06:30 AM',
            endTime: '07:29 AM',
            startParsedTime: '6:30',
            endParsedTime: '7:29',
          },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: '2019-05-18T05:00:00.000Z',
            endDate: '2019-06-01T05:00:00.000Z',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
            startParsedTime: '13:30',
            endParsedTime: '14:27',
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: '2019-05-18T05:00:00.000Z',
            endDate: '2019-06-01T05:00:00.000Z',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
            startParsedTime: '14:30',
            endParsedTime: '15:27',
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: '2019-05-18T05:00:00.000Z',
            endDate: '2019-06-01T05:00:00.000Z',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
            startParsedTime: '15:30',
            endParsedTime: '16:27',
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          {
            nrc: '9626',
            name: 'INTELIGENCIA ARTIFICIAL',
            shortName: 'INTELIGENCIA ARTIFICIAL',
            instructors: '[object Object]',
            type: 'IST 62008',
            place: 'SPACE VIRT',
            startDate: '2019-01-06T05:00:00.000Z',
            endDate: '2019-05-18T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '16:30',
            endParsedTime: '17:27',
          },
          undefined,
          {
            nrc: '9639',
            name: 'INGENIERIA DE REDES Y CONEC I',
            shortName: 'INGENIERIA DE REDES Y CONEC I',
            instructors: '[object Object]',
            type: 'IST 62018',
            place: 'SPACE VIRT',
            startDate: '2019-01-07T05:00:00.000Z',
            endDate: '2019-05-20T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '16:30',
            endParsedTime: '17:27',
          },
          undefined,
          undefined,
        ],
        [
          undefined,
          {
            nrc: '9626',
            name: 'INTELIGENCIA ARTIFICIAL',
            shortName: 'INTELIGENCIA ARTIFICIAL',
            instructors: '[object Object]',
            type: 'IST 62008',
            place: 'SPACE VIRT',
            startDate: '2019-01-06T05:00:00.000Z',
            endDate: '2019-05-18T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '17:30',
            endParsedTime: '18:27',
          },
          undefined,
          {
            nrc: '9639',
            name: 'INGENIERIA DE REDES Y CONEC I',
            shortName: 'INGENIERIA DE REDES Y CONEC I',
            instructors: '[object Object]',
            type: 'IST 62018',
            place: 'SPACE VIRT',
            startDate: '2019-01-07T05:00:00.000Z',
            endDate: '2019-05-20T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '17:30',
            endParsedTime: '18:27',
          },
          undefined,
          undefined,
        ],
        [
          undefined,
          {
            nrc: '9626',
            name: 'INTELIGENCIA ARTIFICIAL',
            shortName: 'INTELIGENCIA ARTIFICIAL',
            instructors: '[object Object]',
            type: 'IST 62008',
            place: 'SPACE VIRT',
            startDate: '2019-01-06T05:00:00.000Z',
            endDate: '2019-05-18T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '18:30',
            endParsedTime: '19:27',
          },
          undefined,
          {
            nrc: '9639',
            name: 'INGENIERIA DE REDES Y CONEC I',
            shortName: 'INGENIERIA DE REDES Y CONEC I',
            instructors: '[object Object]',
            type: 'IST 62018',
            place: 'SPACE VIRT',
            startDate: '2019-01-07T05:00:00.000Z',
            endDate: '2019-05-20T05:00:00.000Z',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
            startParsedTime: '18:30',
            endParsedTime: '19:27',
          },
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      ],
      subjectsByDays: [
        [
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: 'Jan 25, 2019',
            endDate: 'Mar 16, 2019',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
          },
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: 'Apr 05, 2019',
            endDate: 'May 11, 2019',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
          },
          {
            nrc: '9621',
            name: 'MATEMATICAS DISCRETAS AVANZADA',
            shortName: 'MATEMATICAS DISCRETAS AVANZADA',
            instructors: '[object Object]',
            type: 'IST 42007',
            place: 'SPACE VIRT',
            startDate: 'May 18, 2019',
            endDate: 'Jun 01, 2019',
            startTime: '01:30 PM',
            endTime: '04:27 PM',
          },
        ],
        [
          {
            nrc: '9626',
            name: 'INTELIGENCIA ARTIFICIAL',
            shortName: 'INTELIGENCIA ARTIFICIAL',
            instructors: '[object Object]',
            type: 'IST 62008',
            place: 'SPACE VIRT',
            startDate: 'Jan 25, 2019',
            endDate: 'Mar 24, 2019',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
          },
          {
            nrc: '9626',
            name: 'INTELIGENCIA ARTIFICIAL',
            shortName: 'INTELIGENCIA ARTIFICIAL',
            instructors: '[object Object]',
            type: 'IST 62008',
            place: 'SPACE VIRT',
            startDate: 'Apr 06, 2019',
            endDate: 'May 18, 2019',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
          },
        ],
        [],
        [
          {
            nrc: '9639',
            name: 'INGENIERIA DE REDES Y CONEC I',
            shortName: 'INGENIERIA DE REDES Y CONEC I',
            instructors: '[object Object]',
            type: 'IST 62018',
            place: 'SPACE VIRT',
            startDate: 'Jan 25, 2019',
            endDate: 'Mar 26, 2019',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
          },
          {
            nrc: '9639',
            name: 'INGENIERIA DE REDES Y CONEC I',
            shortName: 'INGENIERIA DE REDES Y CONEC I',
            instructors: '[object Object]',
            type: 'IST 62018',
            place: 'SPACE VIRT',
            startDate: 'Apr 07, 2019',
            endDate: 'May 20, 2019',
            startTime: '04:30 PM',
            endTime: '07:27 PM',
          },
        ],
        [],
        [],
        [
          {
            nrc: '9548',
            name: 'INVESTIGACION 2',
            shortName: 'INVESTIGACION 2',
            instructors: '[object Object]',
            type: 'INV 42028',
            place: 'SPACE VIRT',
            startDate: 'Jan 25, 2019',
            endDate: 'May 20, 2019',
            startTime: '06:30 AM',
            endTime: '07:29 AM',
          },
        ],
      ],
    };

    global.axiosMock.onGet().replyOnce(200, response);

    const schedule = await model.pomeloSchedule(CREDENTIALS, USER_ID, TERM_ID);

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
    expect(schedule).toEqual(methodResponse);
  });

  it('Should return error on get pomelo schedule with wrong credentials', async () => {
    global.axiosMock.onGet().replyOnce(401, null);

    const wrongCredentials = {
      username: '',
      password: '',
    };

    await expect(model.pomeloSchedule(wrongCredentials, USER_ID, TERM_ID)).rejects.toThrow('Failed to get schedule');

    expect(global.axiosMock.history.get.length).toBe(1);
    expect(global.axiosMock.history.get[0].baseURL).toBe(config.pomelo.baseURL);
  });
});
