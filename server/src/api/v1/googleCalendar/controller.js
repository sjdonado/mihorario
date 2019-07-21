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
    const { selectedSubjects } = req.body;
    const { accessToken, refreshToken, schedule } = await getRecords(req.username);
    const { subjectsByDays } = JSON.parse(schedule);
    const subjects = subjectsByDays.map(day => day.map((subject) => {
      const selectedSubject = selectedSubjects.find(elem => elem.nrc === subject.nrc);
      if (!selectedSubject) return null;
      const { color, notificationTime } = selectedSubject;
      return Object.assign(subject, { colorId: color.id, notificationTime });
    }).filter(elem => elem));
    const data = await importSchedule({
      access_token: accessToken,
      refresh_token: refreshToken,
    }, subjects);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  all,
  importScheduleToCalendar,
};
