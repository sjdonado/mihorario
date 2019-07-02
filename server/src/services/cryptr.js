const Cryptr = require('cryptr');

const config = require('../config');

const cryptr = new Cryptr(config.cryptr.secret);

/**
 * Encrypt user password
 * @param {String} password
 */
const encryptPassword = password => cryptr.encrypt(password);

/**
 * Decrypt user password
 * @param {String} encryptedPass
 */
const decryptPassword = encryptedPass => cryptr.decrypt(encryptedPass);

module.exports = {
  encryptPassword,
  decryptPassword,
};
