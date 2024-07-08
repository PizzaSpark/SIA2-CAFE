const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');

router.post('/', controller.createRecipe);
router.get('/', controller.getRecipes);
router.get('/:id', controller.getRecipe);
router.put('/:id', controller.updateRecipe);
router.delete('/:id', controller.deleteRecipe);

module.exports = router;