const express = require('express');
const router = express.Router();
const controller = require('../controllers/receiptController');

router.post('/', controller.createReceipt);
router.get('/', controller.getReceipts);
router.get('/:id', controller.getReceipt);
router.put('/:id', controller.updateReceipt);
router.delete('/:id', controller.deleteReceipt);

router.get('/stats', controller.getSalesStats);
router.get('/top', controller.getTopSellers);

module.exports = router;