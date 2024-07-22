const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const upload = require('../middlewares/imageUpload');

router.post('/', upload.single('image'), controller.addProject);
router.get('/', controller.getAllProjects);
router.get('/:id', controller.getProject);
router.put('/:id', upload.single('image'), controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;