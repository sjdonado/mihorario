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
};

module.exports = config;
