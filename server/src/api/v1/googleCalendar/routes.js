const router = require('express').Router();

const controller = require('./controller');
const { auth } = require('../../../services/auth');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.get('/all', auth, controller.all);
router.post('/import', auth, controller.importScheduleToCalendar);

module.exports = router;
