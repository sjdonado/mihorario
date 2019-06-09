const { getWeekEvents, importSchedule } = require('./model');

const all = async (req, res, next) => {
  try {
    const { tokens } = req.session.user;
    console.log('tokens', tokens);
    const data = await getWeekEvents(tokens);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const importScheduleToCalendar = async (req, res, next) => {
  try {
    const { tokens } = req.session.user;
    const { schedule } = req.session.pomelo;
    const data = await importSchedule(tokens, schedule);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  all,
  importScheduleToCalendar,
};
