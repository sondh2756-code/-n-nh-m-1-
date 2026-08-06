const express = require('express');
const router = express.Router();
const controller = require('../controllers/skyEventController');

router.get('/', controller.getSkyEvents);
router.get('/:id', controller.getSkyEventById);
router.post('/', controller.createSkyEvent);
router.put('/:id', controller.updateSkyEvent);
router.delete('/:id', controller.deleteSkyEvent);

module.exports = router;
