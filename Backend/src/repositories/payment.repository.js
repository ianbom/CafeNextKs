const prisma = require('../config/db');

class PaymentRepository { 

    async create(data){ 
        return await prisma.payment.create({ data });
    }

}

module.exports = new PaymentRepository();