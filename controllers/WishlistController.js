const WishList = require("../models/Wishlist");

const createWishList = async (req, res) => {
  console.log(req.body);
  const newWishList = new WishList(req.body);
  
  try {
    const savedWishList = await newWishList.save();
    res.status(201).json(savedWishList);
  } catch (err) {
    console.error("Error while saving wishlist:", err);
    res.status(500).json(err);
  }
};
   
const getWishListById = async (req, res) => {
  const uid = req.query.userId; // Use query parameter
  try {
    await WishList.findOne({ userId: uid }).then(async (wishlist) => {
      if (wishlist) {
        res.status(200).json(wishlist);
      } else {
        res.status(404).json({ msg: 'Wishlist not found' });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateWishList = async (req, res) => {
  const { id, products } = req.body;

  if (!id || !products || !Array.isArray(products)) {
    return res.status(400).json({ message: "Wishlist ID and a valid products array are required" });
  }

  try {
    // Find the wishlist by ID
    const wishlist = await WishList.findById(id);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check for duplicates
    const newProducts = products.filter(
      (product) => !wishlist.productIds.includes(product)
    );

    if (newProducts.length === 0) {
      return res.status(200).json({ 
        message: "No new products were added, as they already exist in the wishlist", 
        wishlist 
      });
    }

    // Add new products to the wishlist
    wishlist.productIds = [...wishlist.productIds, ...newProducts];

    // Save the updated wishlist
    const updatedWishList = await wishlist.save();

    res.status(200).json({
      message: "Products added successfully",
      updatedWishList,
    });
  } catch (err) {
    console.error("Error updating wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
    // Extract from query parameters instead of body
    const { userId, productId } = req.query;
  
    try {
      console.log('Query Params:', req.query); // Debugging logs
      // Find the wishlist by userId
      const wishlist = await WishList.findOne({ userId });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      // Filter out the product to remove
      const updatedProducts = wishlist.productIds.filter(
        (product) => product.toString() !== productId
      );
  
      // If no changes occurred (e.g., product wasn't in the list)
      if (wishlist.productIds.length === updatedProducts.length) {
        return res
          .status(404)
          .json({ message: 'Product not found in the wishlist' });
      }
  
      // Update the wishlist
      wishlist.productIds = updatedProducts;
      const updatedWishList = await wishlist.save();
  
      return res.status(200).json({
        message: 'Product removed successfully',
        updatedWishList,
      });
    } catch (err) {
      console.error('Error:', err.message); // Debugging logs
      return res.status(500).json({
        message: 'Error occurred while removing product',
        error: err.message,
      });
    }
  };
  
  
  

module.exports = {
    createWishList,getWishListById,updateWishList,deleteWishList,removeProductFromWishList
}