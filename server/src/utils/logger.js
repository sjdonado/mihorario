const pino = require('pino');
const moment = require('moment');

const logger = pino({
  level: process.env.PINO_LEVEL,
  prettyPrint: true,
  messageKey: 'message',
  timestamp: () => `,"time":"${moment().format('YYYY-MM-DD HH:mm:ss')}"`,
  base: {},
});

module.exports = logger;
