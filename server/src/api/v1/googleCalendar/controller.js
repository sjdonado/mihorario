const { getWeekEvents, importSchedule } = require('./model');

const all = async (req, res, next) => {
  try {
    const { tokens } = req.session.user;
    const data = await getWeekEvents(tokens);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const importScheduleToCalendar = async (req, res, next) => {
  try {
    const { notificationTime } = req.body;
    const { tokens } = req.session.user;
    const { subjectsByDays } = req.session.pomelo;
    const data = await importSchedule(tokens, subjectsByDays, notificationTime);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  all,
  importScheduleToCalendar,
};
