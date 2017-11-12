var express = require('express');
var controller = require('./controller');

var router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);

router.get('/:campaign_id', controller.show);
router.put('/:campaign_id', controller.update);
router.delete('/:campaign_id', controller.delete);

module.exports = router;