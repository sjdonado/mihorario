/**
 * Scraper service
 * @author sjdonado
 * @since 1.0.0
 */

const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

client.on('error', (err) => {
  console.log('Redis error: ', err);
});

/**
 * Get user records
 * @param {String} username
 */
const getRecords = username => new Promise((resolve, reject) => {
  client.hgetall(username, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

/**
 * Set a user record
 * @param {String} username
 * @param {String} key
 * @param {String} value
 */
const setRecord = (username, key, value) => client.hset(username, key, value, redis.print);

/**
 * Remove user records
 * @param {String} username
 */
const removeRecords = username => client.hdel(username);

module.exports = {
  getRecords,
  setRecord,
  removeRecords,
};
