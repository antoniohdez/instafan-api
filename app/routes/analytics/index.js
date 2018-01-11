var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.get('/summary', controller.summarize);
router.post('/', controller.log);

router.get('/target/:target_id', controller.show);

module.exports = router;