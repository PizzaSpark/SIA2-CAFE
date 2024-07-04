const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');
const upload = require('../middlewares/imageUpload');

router.post('/', upload.single('image'), controller.createMenuItem);
router.get('/', controller.getAllMenuItems);
router.get('/:id', controller.getMenu);
router.put('/:id', upload.single('image'), controller.updateMenuItem);
router.delete('/:id', controller.deleteMenuItem);

module.exports = router;