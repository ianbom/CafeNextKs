const categoryRepository = require('../repositories/category.repository')

class CategoryService { 

    async createCategory(categoryData){ 
        const existingCategory = await categoryRepository.findByName(categoryData.name);
        if (existingCategory) {
            throw new Error('Kategori dengan nama ini sudah dibuat');
        }
        return categoryRepository.create(categoryData);
    }

     async getAllCategories(page = 1, limit = 10) {
     const parsedPage = parseInt(page);
     const parsedLimit = parseInt(limit);
        
     const currentPage = Math.max(1, parsedPage);
     const currentLimit = Math.max(1, parsedLimit);
        
     const skip = (currentPage - 1) * currentLimit;
        
     const categories = await categoryRepository.findAll(skip, currentLimit);

     const totalCategories = await categoryRepository.countAll();
        
     const totalPages = Math.ceil(totalCategories / currentLimit);
        
     return {
       data: categories,
       pagination: {
         totalItems: totalCategories,
         currentPage: currentPage,
         itemsPerPage: currentLimit,
         totalPages: totalPages,
         nextPage: currentPage < totalPages ? currentPage + 1 : null,
         prevPage: currentPage > 1 ? currentPage - 1 : null,
       },
     };
  } 

    async getCategoryById(id){
         console.log('repo', id)
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new Error('Kategori tidak ditemukan')
        }
        return category;
    }

    async getCategoryByName(categoryName){
        const category = categoryRepository.findByName(categoryName);
        if (!category) {
            throw new Error('Kategori tidak ditemukan')
        }
        return category;
    }

    async updateCategory(id, categoryData){ 

        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new Error('Kategori tidak ditemukan')
        }

        if (categoryData.name && categoryData.name !== category.name) {
            const existingCategory = await categoryRepository.findByName(categoryData.name);
        if (existingCategory && existingCategory.id !== parseInt(id)) {
            throw new Error('Category with this name already exists.');
      }
    }
    return categoryRepository.update(id, categoryData);

    }

    async deleteCategory(id){ 
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new Error('Kategori tidak ditemukan')
        }
        return categoryRepository.delete(id)
    }

}

module.exports = new CategoryService();