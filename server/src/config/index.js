require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
  },
  session: {
    secret: process.env.SECRET,
    name: process.env.SESSION_NAME,
  },
  redis: {
    uri: process.env.REDIS_URI,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: process.env.REDIS_TTL,
  },
};

module.exports = config;
