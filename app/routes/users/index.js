var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);

router.get('/:user_id', controller.show);
router.put('/:user_id', controller.update);
router.delete('/:user_id', controller.delete);

module.exports = router;