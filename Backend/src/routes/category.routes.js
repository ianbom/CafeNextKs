const express = require('express'); 
const categoryController = require('../controllers/category.controller')

const router = express.Router();

router.post('/', categoryController.createCategory); // POST /api/categories
router.get('/', categoryController.getAllCategories); // GET /api/categories
router.get('/:id', categoryController.getCategoryById); // GET /api/categories/:id
router.put('/:id', categoryController.updateCategory); // PUT /api/categories/:id
router.delete('/:id', categoryController.deleteCategory); // DELETE /api/categories/:id

module.exports = router;