const orderRepository = require ('../repositories/order.repository.js');
const prisma = require('../config/db');

class OrderService { 

    async chooseTableNumber(orderData){ 
        const dataToCreate = { 
            tableNumber : orderData.tableNumber,
            orderStatus : 'pending'
        }; 
        return await orderRepository.create(dataToCreate);
    }

    async checkoutOrder(orderId, customerName, customerPhone, cartItems) {
        
       
        try {
            const result = await prisma.$transaction(async (tx) => { // mirip db begin transaction
             
                const existingOrder = await tx.order.findUnique({
                    where: { id: parseInt(orderId) },
                    include: { orderItems: true } 
                });

                if (!existingOrder) {
                    throw new Error('Order not found or invalid Order ID.');
                }

                if (existingOrder.orderStatus !== 'pending') {
                    throw new Error(`Order with ID ${orderId} has already been processed with status: ${existingOrder.orderStatus}.`);
                }

                let totalAmount = 0;
                let estimatedTotalTime = 0;
                const newOrderItemsToCreate = [];

                const menuIds = cartItems.map(item => item.menuId);
                
                const menus = await tx.menu.findMany({  // mirip whereIn
                    where: { id: { in: menuIds } }
                });
                
                const menuMap = new Map(menus.map(menu => [menu.id, menu])); // mapping by menuId 
                menuMap

                for (const item of cartItems) {
                    const menu = menuMap.get(item.menuId);
                    
                    if (!menu) {
                        throw new Error(`Menu with ID ${item.menuId} not found.`);
                    }
                    if (!menu.isAvailable) {
                        throw new Error(`Menu "${menu.name}" is currently not available.`);
                    }

                    const quantity = parseInt(item.quantity);
                    if (isNaN(quantity) || quantity <= 0) {
                        throw new Error(`Invalid quantity for menu ${menu.name}.`);
                    }

                    const itemPrice = menu.price;
                    const itemEstimatedTime = menu.estimatedTime;
                    const subtotal = itemPrice * quantity;
                    const estimatedTime = itemEstimatedTime * quantity;

                    totalAmount += subtotal;
                    estimatedTotalTime += estimatedTime;
                    // estimatedTotalTime = Math.max(estimatedTotalTime, menu.estimatedTime);

                    newOrderItemsToCreate.push({
                        orderId: parseInt(orderId),
                        menuId: menu.id,
                        quantity: quantity,
                        price: itemPrice,
                        notes: item.notes || null,
                        subtotal: subtotal,
                    });
                }

              
                const taxRate = 0.10; // 10%
                const serviceCharge = 1000; // IDR 1000
                const taxAmount = totalAmount * taxRate;
                const finalTotalAmount = totalAmount + taxAmount + serviceCharge;

                
                const updatedOrderData = {
                    customerName: customerName || null,
                    customerPhone: customerPhone || null,
                    totalAmount: finalTotalAmount,
                    tax: Math.round(taxAmount),
                    serviceCharge: serviceCharge,
                    orderStatus: 'pending', // Tetap 'pending' setelah checkout awal, nanti bisa diubah ke 'preparing' dll.
                    estimatedTime: estimatedTotalTime,
                };

                const updatedOrder = await tx.order.update({
                    where: { id: parseInt(orderId) },
                    data: updatedOrderData,
                });

                if (newOrderItemsToCreate.length > 0) {
                    await tx.orderItem.createMany({ data: newOrderItemsToCreate });
                } else {
                    throw new Error('No items in cart to checkout.');
                }

               
                const finalOrderWithItems = await tx.order.findUnique({
                    where: { id: parseInt(orderId) },
                    include: {
                        orderItems: {
                            include: {
                                menu: true
                            }
                        }
                    }
                });
                return finalOrderWithItems;
            });

            return result;

        } catch (error) {
            console.error("Error during checkout transaction:", error);
            throw error; // Lempar kembali error untuk ditangani controller
        }
    }

    async detailOrder(id){ 
       
        const order = await orderRepository.findById(id)
        
        return order;
    }

   
}

module.exports = new OrderService();
