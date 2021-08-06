const router = require('express').Router();

const controller = require('./controller');

router.get('/users', controller.countAllUsers);

module.exports = router;
