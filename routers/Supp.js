const express = require('express');
const router = express.Router();
const SupplementController = require('../controllers/SuppController');

// Create a new Supplement
router.post('/supp/create', SupplementController.createSupplement);

// Get all Supplements
router.get('/supp', SupplementController.getAllSupplements);

// Get a single Supplement by ID
router.get('/supp/:id', SupplementController.getSupplementById);

// Update a Supplement by ID
router.put('/supp/update/:id', SupplementController.updateSupplement);

// Delete a Supplement by ID
router.delete('/supp/delete/:id', SupplementController.deleteSupplement);

module.exports = router;
