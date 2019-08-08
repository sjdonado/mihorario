const router = require('express').Router();

const controller = require('./controller');
const { auth } = require('../../../services/auth');

router.get('/schedule', auth, controller.getSchedule);

router.post('/login', controller.login);

module.exports = router;
