const prisma = require('../config/db');

class OrderRepository { 

    async create(data) { 
        
        return prisma.order.create({data});

    }

    async findAll(skip = 0, take = 10) { 
      return prisma.order.findMany({
        skip: skip,
        take: take,
        orderBy: { 
          name: 'asc'
        }
      });
    }

    async countAll() {
      return prisma.order.count();
    }


    async findById(id) {
        return prisma.order.findUnique({ 
            where: {id: parseInt(id)}, 
            include : { 
                orderItems : { 
                    include : {
                        menu:true
                    }
                }
            }
        });
    }

    async findByCustomerName(customerName) {
    return prisma.order.findUnique({
      where: { customerName: customerName },
    });
  }

  
    async update(id, data) {
    return prisma.order.update({
      where: { id: parseInt(id) },
      data,
    });
  }

 
    async delete(id) {
    return prisma.order.delete({
      where: { id: parseInt(id) },
    });
  }

}

module.exports = new OrderRepository();