const { Router } = require('express');

const users = require('./users/routes');
const googleCalendar = require('./googleCalendar/routes');
const statistics = require('./statistics/routes');

const router = Router();

router.use('/users', users);
router.use('/google-calendar', googleCalendar);
router.use('/statistics', statistics);

module.exports = router;
