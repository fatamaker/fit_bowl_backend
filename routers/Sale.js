const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');
const  authenticate = require('../middleware/authenticate')

router.post('/sales/create' ,SaleController.createSale);


router.get('/sales' ,SaleController.getAllSales);


router.get('/sales/:id', SaleController.getSaleById);


router.put('/sales/update/:id', SaleController.updateSale);


router.delete('/sales/delete/:id', SaleController.deleteSale);

module.exports = router;
