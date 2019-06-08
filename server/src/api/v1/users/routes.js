const router = require('express').Router();

const controller = require('./controller');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.post('/schedule', controller.schedule);
router.post('/logout', controller.logout);

module.exports = router;
