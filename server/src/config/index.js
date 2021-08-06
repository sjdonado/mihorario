require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT,
    clientName: process.env.CLIENT_NAME,
    secret: process.env.SECRET,
  },
  calendar: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secretClient: process.env.GOOGLE_SECRET_CLIENT,
    callback: process.env.GOOGLE_CALENDAR_CALLBACK,
  },
  pomelo: {
    baseURL: process.env.POMELO_BASE_URL,
  },
  firebase: {
    credentials: {
      type: 'service_account',
      project_id: 'mihorarioun',
      private_key_id: 'fb2cc9a1a1d385d7c65b7ebb668fc261bdfba9df',
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: 'firebase-adminsdk-tqifm@mihorarioun.iam.gserviceaccount.com',
      client_id: '118373676866750868350',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tqifm%40mihorarioun.iam.gserviceaccount.com',
    },
    USERS_BY_PAGE: 1000,
  },
};

module.exports = config;
