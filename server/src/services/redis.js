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
const setRecord = (username, key, value) => new Promise((resolve, reject) => {
  client.hset(username, key, value, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

/**
 * Check if a record exists
 * @param {String} username
 */
const existsRecord = username => new Promise((resolve, reject) => {
  client.hexists(username, 'password', (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

/**
 * Check if some user record exists
 * @param {String} username
 */
const existsUserRecords = async username => (await Promise.all([
  existsRecord(username, 'password'),
  existsRecord(username, 'schedule'),
  existsRecord(username, 'accessToken'),
  existsRecord(username, 'refreshToken'),
])).some(elem => elem);

/**
 * Remove a record by key and field
 * @param {String} username
 */
const removeRecord = (key, field) => new Promise((resolve, reject) => {
  client.hdel(key, field, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

/**
 * Remove user records
 * @param {String} username
 */
const removeUserRecords = username => Promise.all([
  removeRecord(username, 'password'),
  removeRecord(username, 'schedule'),
  removeRecord(username, 'accessToken'),
  removeRecord(username, 'refreshToken'),
]);

module.exports = {
  getRecords,
  setRecord,
  existsUserRecords,
  removeUserRecords,
};
