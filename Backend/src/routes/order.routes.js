const express = require('express'); 
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.post('/choose-table', orderController.chooseTableOrder)
router.post('/:orderId/checkout', orderController.checkoutOrder)
router.get('/:id/payment', orderController.detailOrder)

module.exports = router;