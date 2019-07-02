const router = require('express').Router();

const controller = require('./controller');
const { auth } = require('../../../services/auth');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.get('/schedule/options', auth, controller.getPomeloScheduleOptions);
router.get('/schedule', auth, controller.getSchedule);

router.post('/login', controller.login);
router.post('/login/google', auth, controller.googleLogin);
router.post('/logout', auth, controller.logout);

module.exports = router;
