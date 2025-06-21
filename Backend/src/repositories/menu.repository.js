const prisma = require('../config/db');

class MenuRepository {
  // CREATE
  async create(data) {
    // console.log(data)
    return prisma.menu.create({ data });
  }

  // READ All with Pagination (Mirip dengan kategori)
  async findAll(skip = 0, take = 10, categoryId = null) {
    const where = {};
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    return prisma.menu.findMany({
      skip: skip,
      take: take,
      where: where,
      include: {
        category: true, // Sertakan data kategori
        images: true    // Sertakan data gambar menu
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  // READ By ID
  async findById(id) {
    return prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: true
      }
    });
  }

  // READ By Name
  async findByName(name) {
    return prisma.menu.findUnique({
      where: { name: name },
    });
  }

  // UPDATE
  async update(id, data) {
    return prisma.menu.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  // DELETE
  async delete(id) {
    // Pastikan untuk menangani penghapusan terkait (misalnya MenuImage) jika tidak ada cascade delete di DB
    // Atau bisa juga atur cascade delete di schema.prisma: onDelete: Cascade pada @relation
    // Untuk saat ini, kita anggap Prisma/DB akan menangani atau tidak ada MenuImage yang terkait
    return prisma.menu.delete({
      where: { id: parseInt(id) },
    });
  }

  // Count total menus (dengan filter kategori)
  async countAll(categoryId = null) {
    const where = {};
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    return prisma.menu.count({ where: where });
  }
}

module.exports = new MenuRepository();