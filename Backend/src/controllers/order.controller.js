const orderService = require('../services/order.service');

class OrderController { 

    async chooseTableOrder(req, res){ 
       
        const { tableNumber } = req.body;
        try {
            const order = await orderService.chooseTableNumber({tableNumber});
            res.status(201).json(order);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message }); 
        }

    }

    async checkoutOrder(req, res) {
      
        const { orderId } = req.params;
        const { customerName, customerPhone, cartItems } = req.body;

        

        if (!orderId || isNaN(orderId)) {
            return res.status(400).json({ error: 'Valid Order ID is required in URL.' });
        }
        if (!customerName) {
            return res.status(400).json({ error: 'Customer name is required.' });
        }
        
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart items cannot be empty.' });
        }
        
        for (const item of cartItems) {
            if (!item.menuId || isNaN(item.menuId) || !item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
                return res.status(400).json({ error: 'Each cart item must have a valid menuId and quantity.' });
            }
        }

        try {
            const finalOrder = await orderService.checkoutOrder(parseInt(orderId), customerName, customerPhone, cartItems);
            res.status(200).json(finalOrder);
        } catch (error) {
            console.error('Error during checkout:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async detailOrder(req, res){ 

        const {id} = req.params;
       
        try {
            const order = await orderService.detailOrder(id)
            res.status(200).json(order);
        } catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }

    }


}

module.exports = new OrderController();