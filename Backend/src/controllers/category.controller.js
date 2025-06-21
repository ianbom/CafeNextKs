const categoryService = require('../services/category.service')
// const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator'); // Impor skema Joi

class CategoryController { 


  async createCategory(req, res) {
    const { name, description } = req.body;
   
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    try {
      const newCategory = await categoryService.createCategory({ name, description });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message }); 
    }
  }

  async getAllCategories(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    try {
      const result = await categoryService.getAllCategories(page, limit);
    
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching categories with pagination:', error); // Log error untuk debugging
      res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
  }

   async getCategoryById(req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }
    try {
      const category = await categoryService.getCategoryById(id);
      res.json( category);
    } catch (error) {
      res.status(404).json({ error: error.message }); 
    }
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }
    if (!name && !description) {
      return res.status(400).json({ error: 'At least one field (name or description) is required for update.' });
    }

    try {
      const updatedCategory = await categoryService.updateCategory(id, { name, description });
      res.json(updatedCategory);
    } catch (error) {
      if (error.message === 'Category not found.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message }); // Tangani error lain dari service
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }
    try {
      await categoryService.deleteCategory(id);
      res.status(204).json('Kategori berhasil dihapus'); 
    } catch (error) {
      if (error.message === 'Category not found.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to delete category.' });
    }
  }


}

module.exports = new CategoryController();