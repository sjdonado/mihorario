const serverless = require('serverless-http');

const app = require('./src/');

module.exports.handler = serverless(app);
