const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController'); 

// Create a new product
router.post('/products/create', ProductController.createProduct);

// Get all products
router.get('/products', ProductController.getAllProducts);

// Get sorted products by sales
router.get('/products/sorted', ProductController.getSortedProducts);

// Get a single product by ID
router.get('/products/:id', ProductController.getProductById);

// Update a product by ID
router.put('/products/update/:id', ProductController.updateProduct);

// Delete a product by ID
router.delete('/products/delete/:id', ProductController.deleteProduct);

// Get products by category
router.get('/products/category/:category', ProductController.getProductsByCategory);

module.exports = router;
