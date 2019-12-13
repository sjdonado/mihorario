const http = require('http');

const app = require('./src/');
const config = require('./src/config/');

const {
  port,
  hostname,
} = config.server;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server http://${hostname}:${port} \x1b[32m%s\x1b[0m`, 'online');
});
