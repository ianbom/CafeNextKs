const orderRepository = require ('../repositories/order.repository.js');
const paymentRepository = require ('../repositories/payment.repository.js');
const prisma = require('../config/db');
const {snap} = require('../config/midtrans')
const {PaymentStatus, OrderStatus} = require('@prisma/client')

class OrderService { 

    async chooseTableNumber(orderData){ 
        const dataToCreate = { 
            tableNumber : orderData.tableNumber,
            orderStatus : 'pending'
        }; 
        return await orderRepository.create(dataToCreate);
    }

async checkoutOrder(orderId, customerName, customerPhone, cartItems) {
    let result;
    
    try {
        // Pisahkan operasi Midtrans dari database transaction untuk mengurangi lock time
        result = await prisma.$transaction(async (tx) => {
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
            
            const menus = await tx.menu.findMany({
                where: { id: { in: menuIds } }
            });
            
            const menuMap = new Map(menus.map(menu => [menu.id, menu]));

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
                orderStatus: 'pending',
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

            // Return data yang diperlukan untuk proses selanjutnya
            return {
                orderId: parseInt(orderId),
                totalAmount: finalTotalAmount,
                taxAmount: Math.round(taxAmount),
                serviceCharge: serviceCharge,
                taxRate: taxRate,
                customerName: customerName || 'Guest',
                customerPhone: customerPhone || 'N/A',
                orderItems: newOrderItemsToCreate
            };
        }, { 
            timeout: 10000, // Kurangi timeout menjadi 10 detik
            isolationLevel: 'ReadCommitted' // Tambahkan isolation level untuk mengurangi lock
        });

        // Proses Midtrans di luar transaction untuk menghindari lock timeout
        const midtransOrderId = `ORDER-${result.orderId}-${Date.now()}`;

        // Buat item details untuk Midtrans
        const itemDetails = [];
        
        // Ambil detail menu untuk item details
        const menus = await prisma.menu.findMany({
            where: { 
                id: { 
                    in: result.orderItems.map(item => item.menuId) 
                } 
            }
        });
        
        const menuMap = new Map(menus.map(menu => [menu.id, menu]));
        
        result.orderItems.forEach(item => {
            const menu = menuMap.get(item.menuId);
            itemDetails.push({
                id: item.menuId ? String(item.menuId) : '0',
                name: menu ? menu.name : 'Unknown Item',
                price: item.price || 0,
                quantity: item.quantity || 0,
            });
        });

        // Tambahkan tax dan service charge
        itemDetails.push({
            id: 'TAX',
            name: `Tax (${result.taxRate * 100}%)`,
            price: result.taxAmount,
            quantity: 1,
        });
        itemDetails.push({
            id: 'SERVICE_CHARGE',
            name: 'Service Charge',
            price: result.serviceCharge,
            quantity: 1,
        });

        const parameter = {
            transaction_details: {
                order_id: midtransOrderId,
                gross_amount: result.totalAmount,
            },
            customer_details: {
                first_name: result.customerName,
                phone: result.customerPhone,
                email: "customer@example.com",
            },
            item_details: itemDetails,
            callbacks: {
                // finish: `${process.env.APP_URL}/api/payments/status/${result.orderId}`,
                // error: `${process.env.APP_URL}/api/payments/status/${result.orderId}`,
                // pending: `${process.env.APP_URL}/api/payments/status/${result.orderId}`,
            }
        };

        const snapResponse = await snap.createTransaction(parameter);
        const snapToken = snapResponse.token;
        const redirectUrl = snapResponse.redirect_url;

        // Buat payment record di luar transaction utama
        const paymentData = {
            orderId: result.orderId,
            amount: result.totalAmount,
            paymentStatus: 'pending',
            midtransSnapToken: snapToken,
            midtransOrderId: midtransOrderId,
            midtransResponse: snapResponse,
        };

        // Gunakan transaction terpisah untuk create payment dengan timeout yang lebih pendek
        const payment = await prisma.$transaction(async (tx) => {
            return await tx.payment.create({
                data: paymentData
            });
        }, {
            timeout: 5000,
            isolationLevel: 'ReadCommitted'
        });

        // Ambil final order dengan items untuk return
        const finalOrderWithItems = await prisma.order.findUnique({
            where: { id: result.orderId },
            include: {
                orderItems: {
                    include: {
                        menu: true
                    }
                },
                payments: true // Include payment info
            }
        });

        return {
            ...finalOrderWithItems,
            snapToken,
            redirectUrl,
            payment
        };

    } catch (error) {
        console.error("Error during checkout transaction:", error);
        
        // Handle specific MySQL lock timeout error
        if (error.message.includes('Lock wait timeout exceeded')) {
            throw new Error('Database is busy, please try again in a few moments.');
        }
        
        throw error;
    }
}

    async detailOrder(id){ 
       
        const order = await orderRepository.findById(id)
        
        return order;
    }

   
}

module.exports = new OrderService();
