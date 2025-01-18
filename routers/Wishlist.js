const express = require('express')
const router = express.Router()
const  authenticate = require('../middleware/authenticate')
const WishListController = require ('../controllers/WishlistController')


router.post('/wishlist/add',authenticate ,WishListController.createWishList)
router.get('/wishlist/get',authenticate,WishListController.getWishListById)
router.put('/wishlist/update',authenticate,WishListController.updateWishList)
router.delete('/wishlist/delete', WishListController.deleteWishList)
router.delete('/wishlist/remove-product',authenticate, WishListController.removeProductFromWishList)

module.exports=router