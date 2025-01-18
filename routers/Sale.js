const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');
const  authenticate = require('../middleware/authenticate')

router.post('/sales/create',authenticate ,SaleController.createSale);


router.get('/sales',authenticate ,SaleController.getAllSales);


router.get('/sales/:id',authenticate, SaleController.getSaleById);


router.put('/sales/update/:id',authenticate, SaleController.updateSale);


router.delete('/sales/delete/:id',authenticate, SaleController.deleteSale);

module.exports = router;
