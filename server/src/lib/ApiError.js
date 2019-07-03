/**
 * ApiError
 * @author sjdonado
 * @since 1.0.0
 */

class ApiError extends Error {
  /**
   * ApiError constructor
   * @param {String} message
   * @param {Number} statusCode
   */
  constructor(message, statusCode) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.statusCode = statusCode || 500;
  }
}

module.exports = ApiError;
