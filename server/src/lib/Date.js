const moment = require('moment');

const parsePomeloDate = (pomeloDate, utcOffset = false) => {
  const momentDate = moment(`${pomeloDate}`, 'MMM DD, YYYY', 'es');
  if (utcOffset) {
    return momentDate.utcOffset('-05:00').format();
  }
  return momentDate.format();
};

const parsePomeloDateToCalendar = (pomeloDate, utcOffset) => ({
  dateTime: parsePomeloDate(pomeloDate, utcOffset),
  // dateTime: startDateTime.add(dayNumber, 'days').utcOffset('-05:00').format(),
  timeZone: 'America/Bogota',
});

module.exports = {
  parsePomeloDate,
  parsePomeloDateToCalendar,
};
