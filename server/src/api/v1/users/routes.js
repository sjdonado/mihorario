const router = require('express').Router();

const controller = require('./controller');

// router.route('/')
//   .get(controller.read)
//   .post(controller.create)
//   .put(controller.update);

router.get('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;
