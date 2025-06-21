// src/controllers/menu.controller.js
const menuService = require('../services/menu.service');
const { createMenuSchema, updateMenuSchema } = require('../validators/menu.validator');
const multer = require('multer'); // Impor multer
const upload = multer({ dest: 'uploads/' });

class MenuController {
  // Create Menu
  async createMenu(req, res) {
    try {
      // Panggil middleware multer secara manual untuk menangani upload file
      // Ini AKAN mengisi req.body untuk field teks, dan req.file untuk field file
      await new Promise((resolve, reject) => {
        upload.single('thumbnail')(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // --- PENTING: Pindahkan validasi Joi KE SINI, setelah multer selesai ---
      const { error, value } = createMenuSchema.validate(req.body); // req.body sekarang sudah terisi!
      console.log('INI DATA SETELAH MULTER & JOI:', value);

      if (error) {

        if (req.file && req.file.path) {
            await fs.promises.unlink(req.file.path).catch(err => console.error("Failed to delete temp file after Joi error:", err));
        }
        return res.status(400).json({ error: error.details[0].message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Thumbnail image is required.' });
      }

      const menuDataWithImage = {
        ...value, // Gunakan value yang sudah divalidasi
        thumbnailPath: req.file.path
      };

      const newMenu = await menuService.createMenu(menuDataWithImage);
      res.status(201).json(newMenu);
    } catch (error) {
      console.error("Error in createMenu controller:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get All Menus with Pagination and Category Filter
  async getAllMenus(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const categoryId = req.query.categoryId || null; // Tambahkan filter berdasarkan categoryId

    try {
      const result = await menuService.getAllMenus(page, limit, categoryId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching menus:', error);
      res.status(500).json({ error: 'Failed to retrieve menus.' });
    }
  }

  // Get Menu by ID
  async getMenuById(req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID menu harus berupa angka.' });
    }
    try {
      const menu = await menuService.getMenuById(id);
      res.json(menu);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update Menu
  async updateMenu(req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID menu harus berupa angka.' });
    }
   
   

    try {
      // Panggil middleware multer secara manual untuk menangani upload (jika ada file baru)
      await new Promise((resolve, reject) => {
        upload.single('thumbnail')(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

    // Validasi body (text fields)
    const { error, value } = updateMenuSchema.validate(req.body);
     console.log('Update data', value);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

      const menuDataToUpdate = { ...value };
      

      if (req.file) {
        // Jika ada file baru diupload, tambahkan path-nya
        menuDataToUpdate.thumbnailPath = req.file.path;
      }

      const updatedMenu = await menuService.updateMenu(id, menuDataToUpdate);
      res.json(updatedMenu);
    } catch (error) {
      console.error("Error in updateMenu controller:", error);
      if (error.message === 'Menu not found.' || error.message.includes('Category not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Delete Menu
  async deleteMenu(req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID menu harus berupa angka.' });
    }
    try {
      await menuService.deleteMenu(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Menu not found.') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error deleting menu:', error);
      res.status(500).json({ error: 'Failed to delete menu.' });
    }
  }
}

module.exports = new MenuController();