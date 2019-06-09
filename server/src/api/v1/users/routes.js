const router = require('express').Router();

const controller = require('./controller');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.get('/schedule', controller.getSchedule);

router.post('/login', controller.login);
router.post('/logout', controller.logout);

module.exports = router;
