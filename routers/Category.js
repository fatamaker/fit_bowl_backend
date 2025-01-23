const express = require('express')
const router = express.Router()

 

const CategoryController = require ('../controllers/CategoryController')


router.post('/category/add', CategoryController.createCategory)
router.get('/category/:id', CategoryController.getCategoryById)
router.get('/category', CategoryController.getAllCategories)
router.put('/category/update/:id',CategoryController.updateCategory)
router.delete('/category/delete/:id', CategoryController.deleteCategory)

module.exports = router; 