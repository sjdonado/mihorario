/**
 * RavenService - Errors report
 * @author krthr
 * @since 1.0.0
 */

const Raven = require('raven');
Raven.config(process.env.RAVEN).install();

module.exports = {
  reportError: (e, data) => {
    Raven.captureException(e, {
      extra: data
    })
  }
}