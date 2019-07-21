require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    clientName: process.env.CLIENT_NAME,
  },
  session: {
    secret: process.env.SECRET,
    name: process.env.SESSION_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    ttl: process.env.REDIS_TTL,
  },
  calendar: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secretClient: process.env.GOOGLE_SECRET_CLIENT,
    callback: process.env.CALLBACK,
  },
  token: {
    secret: process.env.SECRET,
  },
  cryptr: {
    secret: process.env.CRYPTR_SECRET,
  },
};

module.exports = config;
