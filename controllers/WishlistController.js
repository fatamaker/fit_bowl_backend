const WishList = require("../models/Wishlist");

const createWishList =async (req,res)=>{
    const newWishList = new WishList(req.body);
    try {
      const savedWishList = await newWishList.save();
      res.status(201).json(savedWishList);
    } catch (err) {
      res.status(500).json(err);
    }
  }
   
  const getWishListById =async (req,res)=>{
    var uid =req.body.userId
    try {
         await WishList.findOne({ userId:uid }).then(async wishlist=>{
          if(wishlist){
            res.status(200).json(wishlist);
          }else{
            res.status(404).json({msg:'wishlist not found'});
          }
        })
      } catch (err) {
        res.status(500).json(err);
      }
  }

  const updateWishList =async (req,res)=>{
    var id = req.body.id
    var products = req.body.products

    try {
      const updatedWishList = await WishList.findByIdAndUpdate(
        id,
        {
            products: products,
        },
        { new: true }
      );
      res.status(200).json(updatedWishList);
    } catch (err) {
      res.status(500).json(err);
    }
 
  }

  const deleteWishList =async (req,res)=>{
    var id  = req.body.id;
  
    try {
      const wishlist = await WishList.findByIdAndDelete(id);
      if (!wishlist) {
        return res.status(404).json({ message: 'wishlist not found' });
      }else{
                res.status(200).json({ message: 'wishlist deleted successfully' });

      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while deleting wishlist' });
    }
  }


  const removeProductFromWishList = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      // Find the wishlist by userId
      const wishlist = await WishList.findOne({ userId });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      // Filter out the product to remove
      const updatedProducts = wishlist.products.filter(
        (product) => product.toString() !== productId
      );
  
      // If no changes occurred (e.g., product wasn't in the list)
      if (wishlist.products.length === updatedProducts.length) {
        return res
          .status(404)
          .json({ message: 'Product not found in the wishlist' });
      }
  
      // Update the wishlist
      wishlist.products = updatedProducts;
      const updatedWishList = await wishlist.save();
  
      res.status(200).json({
        message: 'Product removed successfully',
        updatedWishList,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error occurred while removing product',
        error: err.message,
      });
    }
  };
  

module.exports = {
    createWishList,getWishListById,updateWishList,deleteWishList,removeProductFromWishList
}