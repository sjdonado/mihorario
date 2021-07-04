const http = require('http');

const logger = require('./src/utils/logger');
const app = require('./src/');
const config = require('./src/config/');

const {
  port,
} = config.server;

const server = http.createServer(app);

server.listen(port, (hostname) => {
  logger.info(`Server listening on ${port}`);
});
