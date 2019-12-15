const http = require('http');

const app = require('./src/');
const config = require('./src/config/');

const {
  port,
} = config.server;

const server = http.createServer(app);

server.listen(port, (hostname) => {
  console.log('\x1b[32m%s\x1b[0m', `Server listening on ${port}`);
});
