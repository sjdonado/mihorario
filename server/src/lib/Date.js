const moment = require('moment');

const TIME_ZONE = 'America/Bogota';

/**
 * parsePomeloDateTime
 * @param {*} dateTime Pomelo date time MMM DD, YYYY
 * @param {boolean} utcOffset America/Bogota offset
 */
const parsePomeloDateTime = (pomeloDate, utcOffset = false) => {
  const momentDate = moment(`${pomeloDate}`, 'MMM DD, YYYY', 'es');
  if (utcOffset) {
    return momentDate.tz(TIME_ZONE).format();
  }
  return momentDate.format();
};

/**
 * parsePomeloDateToCalendar
 * @param {*} dateTime Pomelo date time MMM DD, YYYY or momentDate
 * @param {boolean} parse Parse pomelo date time
 */
const parsePomeloDateToCalendar = (dateTime, parse = false) => {
  const response = {
    timeZone: TIME_ZONE,
  };
  if (parse) {
    Object.assign(response, { dateTime: parsePomeloDateTime(dateTime, true) });
  } else {
    Object.assign(response, { dateTime: dateTime.tz(TIME_ZONE).format() });
  }
  return response;
};

module.exports = {
  parsePomeloDateTime,
  parsePomeloDateToCalendar,
};
