var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.get('/', controller.summarize);
router.post('/', controller.log);

router.get('/:target_id', controller.show);

module.exports = router;