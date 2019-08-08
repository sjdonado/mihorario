const { getWeekEvents, importSchedule } = require('./model');

const all = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.body;

    const data = await getWeekEvents(req.user, {
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
    const { accessToken, refreshToken, subjects } = req.body;
    // console.log('SUBJECTS ==>', subjects);
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
