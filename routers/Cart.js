const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController'); 


router.post('/cart/add', cartController.addSaleToCart);


router.post("/cart/create", cartController.createCart);

router.get('/cart/:userId',cartController.getCartByUser);


router.post('/cart/remove', cartController.removeSaleFromCart);


router.post('/cart/clear/:userId', cartController.clearCart);

module.exports = router;
