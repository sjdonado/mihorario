const router = require('express').Router();

const controller = require('./controller');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.get('/all', controller.all);
router.post('/import', controller.importScheduleToCalendar);

module.exports = router;
