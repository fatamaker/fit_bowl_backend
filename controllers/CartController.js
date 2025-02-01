const Cart = require('../models/Cart');
const Sale = require('../models/Sales');
const mongoose = require('mongoose');


exports.createCart = async (req, res) => {
 
  const { userId } = req.body;

  const newCart = new Cart({
    userId,
    salesIds: [],
    cartTotal: 0, 
  });
  
  try {
    const savedCart = await newCart.save();
    return res.status(201).json(savedCart);
  } catch (err) {
    console.error("Error while creating cart:", err);
    res.status(500).json(err);
  }

};
   


exports.addSaleToCart = async (req, res) => {
  try {
    const { userId, salesIds } = req.body;

    // Validate salesIds
    if (!mongoose.isValidObjectId(salesIds)) {
      return res.status(400).json({ message: 'Invalid salesIds' });
    }

    // Find the sale
    const sale = await Sale.findById(salesIds);
    if (!sale) {
      console.error(`Sale with ID ${salesIds} not found`);
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist, create a new cart
      const newCart = new Cart({
        userId,
        salesID: [salesIds],
        cartTotal: sale.totalprice, // Initialize cartTotal with the sale's totalprice
      });

      const savedCart = await newCart.save();
      return res.status(201).json(savedCart);
    }

    // Check if the sale already exists in the cart
    if (cart.salesIds.includes(salesIds)) {
      return res.status(400).json({ message: 'Sale already exists in the cart' });
    }

    // Add the sale to the cart
    cart.salesIds.push(salesIds);
    cart.cartTotal += sale.totalprice;

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user's cart
exports.getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('salesIds');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Remove a sale from the cart
// exports.removeSaleFromCart = async (req, res) => {
//   try {
//     const { userId, salesIds } = req.body;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const sale = await Sale.findById(salesIds);
//     if (!sale) return res.status(404).json({ message: 'Sale not found' });

//     const originalLength = cart.salesIds.length;
//     cart.salesIds = cart.salesIds.filter((id) => id.toString() !== salesIds);
    


//     const updatedCart = await cart.save();
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Remove a sale from the cart
exports.removeSaleFromCart = async (req, res) => {
  try {
    const { userId, salesIds } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Find the sale
    const sale = await Sale.findById(salesIds);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    // Check if the sale exists in the cart
    if (!cart.salesIds.includes(salesIds)) {
      return res.status(400).json({ message: 'Sale not found in the cart' });
    }

    // Remove the sale from the cart
    cart.salesIds = cart.salesIds.filter((id) => id.toString() !== salesIds);

    // Deduct the sale's total price from cartTotal
    cart.cartTotal -= sale.totalprice;
    if (cart.cartTotal < 0) cart.cartTotal = 0; // Ensure cartTotal doesn't go negative

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error placing order:", error);
  res.status(500).json({ message: error.message });
  }
};


// Clear a user's cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { salesIds: [], cartTotal: 0 },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
