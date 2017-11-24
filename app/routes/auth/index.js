var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.post('/login', controller.login);
router.delete('/logout', controller.logout);

router.post('/register', controller.register);
router.put('/change-password', controller.changePassword);
router.put('/reset-password', controller.resetPassword);

router.get('/verify-token', controller.verifyToken);

module.exports = router;