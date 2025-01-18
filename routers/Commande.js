const express = require('express');
const router = express.Router();
const orderController = require('../controllers/CommandeController'); 
const  authenticate = require('../middleware/authenticate')

// Place an order
router.post('/orders/place',authenticate ,orderController.placeOrder);

// Get all orders for a user
router.get('/orders/user/:userId',authenticate,orderController.getUserOrders);

// Get an order by ID
router.get('/orders/:id',authenticate,orderController.getOrderById);

// Update order status
router.patch('/orders/update-status',authenticate,orderController.updateOrderStatus);

module.exports = router;
