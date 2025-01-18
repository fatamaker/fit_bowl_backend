const Cart = require('../models/Cart');
const Sale = require('../models/Sales');
const mongoose = require('mongoose');


exports.addSaleToCart = async (req, res) => {
  try {
    const { userId, saleId } = req.body;

    // Validate saleId
    if (!mongoose.isValidObjectId(saleId)) {
      return res.status(400).json({ message: 'Invalid saleId' });
    }

    // Find the sale
    const sale = await Sale.findById(saleId);
    if (!sale) {
      console.error(`Sale with ID ${saleId} not found`);
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist, create a new cart
      const newCart = new Cart({
        userId,
        salesID: [saleId],
        cartTotal: sale.totalprice, // Initialize cartTotal with the sale's totalprice
      });

      const savedCart = await newCart.save();
      return res.status(201).json(savedCart);
    }

    // Check if the sale already exists in the cart
    if (cart.salesID.includes(saleId)) {
      return res.status(400).json({ message: 'Sale already exists in the cart' });
    }

    // Add the sale to the cart
    cart.salesID.push(saleId);
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
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('salesID');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a sale from the cart
exports.removeSaleFromCart = async (req, res) => {
  try {
    const { userId, saleId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const sale = await Sale.findById(saleId);
    cart.salesID = cart.salesID.filter((id) => id.toString() !== saleId);

    
    cart.cartTotal -= sale.totalprice;

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear a user's cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { salesID: [], cartTotal: 0 },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
