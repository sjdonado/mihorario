/**
 * Scraper service
 * @author sjdonado
 * @since 1.0.0
 */

const { sign, verify } = require('jsonwebtoken');

const config = require('../config');

/**
 * Generate new token
 * @param {Object} payload
 * @param {String} expiration time
 */
const signToken = (payload, expiresIn = '8h') => sign(payload, config.token.secret, {
  algorithm: 'HS256',
  expiresIn,
});

const auth = (req, res, next) => {
  const token = req.headers.authorization || req.query.token || req.body.token;

  if (!token) next(new Error('Unauthorized'));

  verify(token, config.token.secret, (err, decoded) => {
    if (err) next(new Error('Unauthorized'));
    console.log('USER TOKEN ->', decoded);

    const { username, iat, exp } = decoded;
    if (exp - iat < 0) next(new Error('Token expired'));

    req.username = username;
    next();
  });
};

module.exports = {
  signToken,
  auth,
};
