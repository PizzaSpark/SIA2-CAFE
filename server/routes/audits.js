const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditController');

router.post('/', controller.createAudit);
router.get('/', controller.getAudits);
router.get('/:id', controller.getAudit);

module.exports = router;