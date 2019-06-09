const { Router } = require('express');

const users = require('./users/routes');
const googleCalendar = require('./googleCalendar/routes');

const router = Router();

router.use('/users', users);
router.use('/google-calendar', googleCalendar);

module.exports = router;
