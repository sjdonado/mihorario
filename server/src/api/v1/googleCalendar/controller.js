const {
  getSyncedSubjects,
  importSchedule,
  removeSubjects,
} = require('./model');

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

const importSubjectsToCalendar = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, subjectsMatrix } = req.body;
    const data = await importSchedule({
      access_token: accessToken,
      refresh_token: refreshToken,
    }, subjectsMatrix);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const removeSubjectsFromCalendar = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, subjects } = req.body;
    const data = await removeSubjects({
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
  importSubjectsToCalendar,
  removeSubjectsFromCalendar,
};
