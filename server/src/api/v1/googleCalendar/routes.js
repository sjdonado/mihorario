const router = require('express').Router();

const controller = require('./controller');
const { auth } = require('../../../services/auth');

router.get('/all', auth, controller.all);
router.post('/import', auth, controller.importScheduleToCalendar);

module.exports = router;
