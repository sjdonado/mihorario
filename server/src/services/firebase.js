const admin = require('firebase-admin');

const config = require('../config');

const { USERS_BY_PAGE, credentials } = config.firebase;

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: 'https://mihorarioun.firebaseio.com',
});

const listAllUsers = async (nextPageToken, usersCounter = 0) => {
  try {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(USERS_BY_PAGE, nextPageToken);

    if (pageToken) {
      return listAllUsers(pageToken, usersCounter + USERS_BY_PAGE);
    }

    return usersCounter + users.length;
  } catch (error) {
    return usersCounter;
  }
};

module.exports = {
  listAllUsers,
};
