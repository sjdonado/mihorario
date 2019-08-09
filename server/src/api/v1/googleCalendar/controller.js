const { getSyncedSubjects, importSchedule } = require('./model');

const syncSchedule = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, subjects } = req.body;

    const data = await getSyncedSubjects({
      access_token: accessToken,
      refresh_token: refreshToken,
    }, subjects);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const importScheduleToCalendar = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, subjects } = req.body;
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
  syncSchedule,
  importScheduleToCalendar,
};
