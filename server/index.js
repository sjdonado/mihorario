const http = require('http');

const app = require('./src/');
const config = require('./src/config/');

const {
  port,
  hostname,
} = config.server;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
