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
    url: process.env.REDIS_URL,
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
