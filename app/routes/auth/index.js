var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.post('/login', controller.login);
router.delete('/logout', controller.logout);

router.post('/register', controller.register);
router.put('/changePassword', controller.changePassword);
router.put('/resetPassword', controller.resetPassword);

module.exports = router;