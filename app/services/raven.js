const Raven = require('raven');
Raven.config(process.env.RAVEN).install();

module.exports = {
  reportError: (e) => {
    Raven.captureException(e)
  }
}