const router = require('express').Router();

const controller = require('./controller');
const { auth } = require('../../../services/auth');

router.post('/sync', auth, controller.syncSchedule);
router.post('/import', auth, controller.importScheduleToCalendar);

module.exports = router;
