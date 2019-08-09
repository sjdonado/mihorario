const AWS = require('aws-sdk');

AWS.config.loadFromPath(`${process.cwd()}/credentials.json`);

const lambda = new AWS.Lambda();

/**
 * Get Pomelo schedule
 * @param dataPayload Lambda function event dataPayload
 * @param dataPayload.username Login username
 * @param dataPayload.password Login user password
 * @param {dataPayload.scheduleOption=} null User selected period
 * @param dataPayload.action pomeloSchedulePeriods or pomeloSchedule
 * @return {Promise}
 */
const scraper = dataPayload => new Promise((resolve, reject) => {
  lambda.invoke(Object.assign({
    FunctionName: 'mihorarioun-dev-start',
    InvocationType: 'RequestResponse',
  }, {
    Payload: JSON.stringify(dataPayload),
  }), (err, res) => {
    const { data } = JSON.parse(res.Payload);
    // console.log('SCRAPER RES PAYLOAD =>', data);
    if (err) {
      reject(err);
    }
    if (data && data.error) {
      reject(data.error);
    }
    resolve(data);
  });
});

module.exports = {
  scraper,
};
