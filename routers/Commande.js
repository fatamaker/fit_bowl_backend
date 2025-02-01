const express = require('express');
const router = express.Router();
const orderController = require('../controllers/CommandeController'); 
const  authenticate = require('../middleware/authenticate')

// Place an order
router.post('/orders/place' ,orderController.placeOrder);

// Get all orders for a user
router.get('/orders/user/:userId',orderController.getUserOrders);

// Get an order by ID
router.get('/orders/:id',orderController.getOrderById);

// Update order status
router.patch('/orders/update-status',orderController.updateOrderStatus);

module.exports = router;
