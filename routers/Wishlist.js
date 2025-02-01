const express = require('express')
const router = express.Router()
const  authenticate = require('../middleware/authenticate')
const WishListController = require ('../controllers/WishlistController')


router.post("/wishList/create", WishListController.createWishList);
router.get('/wishlist/get',WishListController.getWishListById)

router.put('/wishlist/update',WishListController.updateWishList)
router.delete('/wishlist/delete', WishListController.deleteWishList)
router.delete('/wishlist/remove-product', WishListController.removeProductFromWishList)



module.exports=router