// src/services/menu.service.js
const menuRepository = require('../repositories/menu.repository');
const categoryRepository = require('../repositories/category.repository'); // Perlu untuk validasi categoryId
const fs = require('fs/promises');
const cloudinary = require('../config/cloudinary');
class MenuService {

  async createMenu(menuData) {
    let thumbnailUrl = null;
    let uploadedFile = null; // Untuk menyimpan hasil upload cloudinary
    // console.log('MENU DATA',menuData);
    try {
        
      const categoryExists = await categoryRepository.findById(menuData.categoryId);
      if (!categoryExists) {
        throw new Error('Category not found for the given categoryId.');
      }

      // Validasi bisnis: Pastikan nama menu unik
      const existingMenu = await menuRepository.findByName(menuData.name);
      if (existingMenu) {
        throw new Error('Menu with this name already exists.');
      }

      // === Upload gambar ke Cloudinary ===
      if (menuData.thumbnailPath) {
        uploadedFile = await cloudinary.uploader.upload(menuData.thumbnailPath, {
          folder: 'cafe-menu-thumbnails', // Folder di Cloudinary
          public_id: `menu-${Date.now()}` // Nama file unik
        });
        thumbnailUrl = uploadedFile.secure_url; // URL HTTPS dari gambar yang diupload
      }

      // Siapkan data untuk repository (hapus thumbnailPath, tambahkan thumbnailUrl)
      const dataToCreate = {
        categoryId: menuData.categoryId,
        name: menuData.name,
        price: menuData.price,
        isAvailable: menuData.isAvailable,
        estimatedTime: menuData.estimatedTime,
        thumbnailUrl: thumbnailUrl // Gunakan URL dari Cloudinary
      };

      const newMenu = await menuRepository.create(dataToCreate);
      return newMenu;

    } catch (error) {
      // Jika terjadi error, pastikan untuk menghapus file yang mungkin sudah terupload di Cloudinary (opsional tapi baik)
      if (uploadedFile && uploadedFile.public_id) {
        // Hapus juga dari Cloudinary jika proses create menu di DB gagal
        await cloudinary.uploader.destroy(uploadedFile.public_id).catch(err => console.error("Failed to delete Cloudinary asset on error:", err));
      }
      throw error; // Lempar kembali error
    } finally {
      // Selalu hapus file sementara dari server setelah diproses
      if (menuData.thumbnailPath) {
        await fs.unlink(menuData.thumbnailPath).catch(err => console.error("Failed to delete local temp file:", err));
      }
    }
  }

  async getAllMenus(page = 1, limit = 10, categoryId = null) {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const currentPage = Math.max(1, parsedPage);
    const currentLimit = Math.max(1, parsedLimit);

    const skip = (currentPage - 1) * currentLimit;

    // Ambil data menu dengan pagination dan filter kategori
    const menus = await menuRepository.findAll(skip, currentLimit, categoryId);
    // Ambil total jumlah menu (dengan filter kategori)
    const totalMenus = await menuRepository.countAll(categoryId);

    const totalPages = Math.ceil(totalMenus / currentLimit);

    return {
      data: menus,
      pagination: {
        totalItems: totalMenus,
        currentPage: currentPage,
        itemsPerPage: currentLimit,
        totalPages: totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async getMenuById(id) {
    const menu = await menuRepository.findById(id);
    if (!menu) {
      throw new Error('Menu not found.');
    }
    return menu;
  }

async updateMenu(id, menuData) {
    let oldThumbnailPublicId = null;
    let uploadedFile = null;

    try {
      const menuExists = await menuRepository.findById(id);
      if (!menuExists) {
        throw new Error('Menu not found.');
      }

      if (menuExists.thumbnailUrl) {
          const parts = menuExists.thumbnailUrl.split('/');
          const filenameWithExtension = parts[parts.length - 1];
          // Asumsi public_id adalah "folder/nama_file_tanpa_ekstensi"
          oldThumbnailPublicId = `cafe-menu-thumbnails/${filenameWithExtension.split('.')[0]}`;
      }

      if (menuData.categoryId) {
        const categoryExists = await categoryRepository.findById(menuData.categoryId);
        if (!categoryExists) {
          throw new Error('Category not found for the given categoryId.');
        }
      }

      if (menuData.name && menuData.name !== menuExists.name) {
        const existingMenu = await menuRepository.findByName(menuData.name);
        if (existingMenu && existingMenu.id !== parseInt(id)) {
          throw new Error('Menu with this name already exists.');
        }
      }

      // === Upload gambar baru ke Cloudinary jika ada thumbnailPath ===
      const dataToUpdate = { ...menuData }; // Salin semua data dari menuData

      if (menuData.thumbnailPath) {
        uploadedFile = await cloudinary.uploader.upload(menuData.thumbnailPath, {
          folder: 'cafe-menu-thumbnails',
          public_id: `menu-${Date.now()}`
        });
        dataToUpdate.thumbnailUrl = uploadedFile.secure_url;

        // Hapus thumbnail lama dari Cloudinary setelah yang baru berhasil diupload
        if (oldThumbnailPublicId) {
            await cloudinary.uploader.destroy(oldThumbnailPublicId).catch(err => console.error("Failed to delete old Cloudinary asset:", err));
        }
      }

      // --- PENTING: Hapus thumbnailPath dari objek sebelum dikirim ke Prisma ---
      // Karena thumbnailPath bukan field di database, hanya properti sementara.
      delete dataToUpdate.thumbnailPath; // <-- TAMBAHKAN BARIS INI

      const updatedMenu = await menuRepository.update(id, dataToUpdate);
      return updatedMenu;

    } catch (error) {
      if (uploadedFile && uploadedFile.public_id) {
          await cloudinary.uploader.destroy(uploadedFile.public_id).catch(err => console.error("Failed to delete newly uploaded Cloudinary asset on error:", err));
      }
      throw error;
    } finally {
      if (menuData.thumbnailPath) {
        await fs.unlink(menuData.thumbnailPath).catch(err => console.error("Failed to delete local temp file:", err));
      }
    }
  }

  async deleteMenu(id) {
    const menuExists = await menuRepository.findById(id);
    if (!menuExists) {
      throw new Error('Menu not found.');
    }
    // Anda bisa menambahkan logika bisnis lain di sini,
    // misalnya, mencegah penghapusan jika menu masih ada di pesanan aktif
    // Atau menghapus gambar-gambar terkait di MenuImage
    return menuRepository.delete(id);
  }
}

module.exports = new MenuService();