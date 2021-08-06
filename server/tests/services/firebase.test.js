const admin = require('firebase-admin');
const firebaseService = require('../../src/services/firebase');

jest.mock('firebase-admin');

admin.initializeApp = jest.fn();

describe('Test firebase service', () => {
  afterEach(() => {
    global.axiosMock.resetHistory();
  });

  it('Should get countAllUsers', async () => {
    const TOTAL_USERS = 2300;
    let remainingUsers = TOTAL_USERS;

    admin.auth = jest.fn(() => ({
      listUsers: jest.fn((usersByPage) => {
        const response = {
          users: new Array(remainingUsers < usersByPage ? remainingUsers : usersByPage),
          pageToken: remainingUsers - usersByPage > 0,
        };
        remainingUsers -= usersByPage;
        return response;
      }),
    }));

    const totalUsersCounter = await firebaseService.listAllUsers();

    expect(totalUsersCounter).toBe(TOTAL_USERS);
  });

  it('Should get countAllUsers with error', async () => {
    admin.auth = jest.fn(() => ({
      listUsers: jest.fn(() => {
        throw new Error('Unexpected error');
      }),
    }));

    const totalUsersCounter = await firebaseService.listAllUsers();

    expect(totalUsersCounter).toBe(0);
  });
});
