const prisma = require('../config/db');

class CategoryRepository { 


    async create(data) { 
        
        return prisma.category.create({data});

    }

    async findAll(skip = 0, take = 10) { 
      return prisma.category.findMany({
        skip: skip,
        take: take,
        orderBy: { 
          name: 'asc'
        }
      });
    }

    async countAll() {
      return prisma.category.count();
    }


    async findById(id) {
        return prisma.category.findUnique({ 
            where: {id: parseInt(id)}
        });
    }

    async findByName(name) {
    return prisma.category.findUnique({
      where: { name: name },
    });
  }

  
    async update(id, data) {
    return prisma.category.update({
      where: { id: parseInt(id) },
      data,
    });
  }

 
    async delete(id) {
    return prisma.category.delete({
      where: { id: parseInt(id) },
    });
  }

}

module.exports = new CategoryRepository();