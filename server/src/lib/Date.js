const moment = require('moment');

/**
 * parsePomeloDateTime
 * @param {*} dateTime Pomelo date time MMM DD, YYYY
 * @param {boolean} utcOffset America/Bogota offset
 */
const parsePomeloDateTime = (pomeloDate, utcOffset = false) => {
  const momentDate = moment(`${pomeloDate}`, 'MMM DD, YYYY', 'es');
  if (utcOffset) {
    return momentDate.utcOffset('-05:00').format();
  }
  return momentDate.format();
};

/**
 * parsePomeloDateToCalendar
 * @param {*} dateTime Pomelo date time MMM DD, YYYY or momentDate
 * @param {boolean} parse Parse pomelo date time
 * @param {boolean} utcOffset America/Bogota offset
 */
const parsePomeloDateToCalendar = (dateTime, parse = false) => {
  const response = {
    timeZone: 'America/Bogota',
  };
  if (parse) {
    Object.assign(response, { dateTime: parsePomeloDateTime(dateTime, true) });
  } else {
    Object.assign(response, { dateTime: dateTime.utcOffset('-05:00').format() });
  }
  return response;
};

module.exports = {
  parsePomeloDateTime,
  parsePomeloDateToCalendar,
};
