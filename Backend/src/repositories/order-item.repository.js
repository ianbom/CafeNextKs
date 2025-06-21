const prisma = require('../config/db');

class OrderItemRepository { 

    async createMany(data) { 
        
        return prisma.orderItem.create({data});

    }

    async findAll(skip = 0, take = 10) { 
      return prisma.orderItem.findMany({
        skip: skip,
        take: take,
        orderBy: { 
          name: 'asc'
        }
      });
    }

    async countAll() {
      return prisma.orderItem.count();
    }


    async findById(id) {
        return prisma.orderItem.findUnique({ 
            where: {id: parseInt(id)}
        });
    }

  
    async update(id, data) {
    return prisma.orderItem.update({
      where: { id: parseInt(id) },
      data,
    });
  }

 
    async delete(id) {
    return prisma.orderItem.delete({
      where: { id: parseInt(id) },
    });
  }

}

module.exports = new OrderItemRepository();