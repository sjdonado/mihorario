/**
 * Scraper service
 * @author sjdonado
 * @since 1.0.0
 */

const { sign, verify } = require('jsonwebtoken');

const ApiError = require('../lib/ApiError');
const { server } = require('../config');

/**
 * Generate new token
 * @param {Object} payload
 * @param {String} expiration time
 */
const signToken = (payload, expiresIn = '24h') => sign(payload, server.secret, {
  algorithm: 'HS256',
  expiresIn,
});

const auth = (req, res, next) => {
  const token = req.headers.authorization || req.query.token || req.body.token;

  if (!token) {
    next(new ApiError('Unauthorized', 401));
    return;
  }

  verify(token, server.secret, (err, decoded) => {
    if (err) {
      next(new ApiError('Unauthorized', 401));
      return;
    }

    const {
      username,
      password,
      iat,
      exp,
    } = decoded;
    if (exp - iat < 0) next(new ApiError('Token expired'));

    req.user = { username, password };
    next();
  });
};

module.exports = {
  signToken,
  auth,
};
