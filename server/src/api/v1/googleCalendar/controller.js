const { getWeekEvents, importSchedule } = require('./model');

const { getRecords } = require('../../../services/redis');

const all = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await getRecords(req.username);
    const data = await getWeekEvents({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const importScheduleToCalendar = async (req, res, next) => {
  try {
    const { notificationTime } = req.body;
    const { accessToken, refreshToken, pomeloData } = await getRecords(req.username);
    const { subjectsByDays } = JSON.parse(pomeloData);
    const data = await importSchedule({
      access_token: accessToken,
      refresh_token: refreshToken,
    }, subjectsByDays, notificationTime);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  all,
  importScheduleToCalendar,
};
