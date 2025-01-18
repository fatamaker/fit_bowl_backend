const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController'); 
const  authenticate = require('../middleware/authenticate')

router.post('/cart/add', cartController.addSaleToCart);


router.get('/cart/:userId',authenticate,cartController.getCartByUser);


router.post('/cart/remove', authenticate,cartController.removeSaleFromCart);


router.post('/cart/clear/:userId',authenticate, cartController.clearCart);

module.exports = router;
