const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockController');

router.post('/', controller.createStock);
router.post('/bulk', controller.createStocks);
router.get('/', controller.getStocks);
router.get('/low-stocks', controller.getLowStocks);
router.get('/:id', controller.getStock);
router.put('/:id', controller.updateStock);
router.post('/update-multiple', controller.updateStocks);
router.post('/update-with-locking', controller.updateStocksWithLocking);
router.delete('/:id', controller.deleteStock);

module.exports = router;