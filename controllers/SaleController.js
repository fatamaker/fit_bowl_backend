const Sale = require('../models/Sales');
const Product = require('../models/Product');  
const User = require('../models/User'); 
const Supplement = require('../models/Supplement'); 
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

// Create a new sale
/* exports.createSale = async (req, res) => {
  try {
    
    const { productId, userId, quantity, totalprice } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

   
    const newSale = new Sale({
      productId,
      userId,
      quantity,
      totalprice,
    });

  
    await newSale.save();

   
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the sale.' + error });
  }
}; */


exports.createSale = async (req, res) => {
  try {
    const { productId, userId, quantity, supplements = [], size } = req.body;

    // Fetch the product details based on the selected productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Ensure the size exists in the product sizes (small, medium, large)
    if (!product.sizes[size]) {
      return res.status(400).json({ error: 'Invalid size selected.' });
    }

    // Validate and calculate the price of supplements (if any)
    let totalSupplementPrice = 0;
    if (supplements.length > 0) {
      // Fetch the supplements from the database
      const validSupplements = await Supplement.find({
        _id: { $in: supplements },
      });

      // Check if all provided supplement IDs are valid
      if (validSupplements.length !== supplements.length) {
        return res
          .status(400)
          .json({ error: 'One or more selected supplements are invalid.' });
      }

      // Calculate the total price for the supplements
      totalSupplementPrice = validSupplements.reduce(
        (total, supplement) => total + supplement.price,
        0
      );
    }

    // Calculate the total price
    const totalPrice = (product.sizes[size].price + totalSupplementPrice) * quantity;

    // Create a new Sale instance
    const newSale = new Sale({
      productId,
      userId,
      quantity,
      supplements, // Store the selected supplement IDs
      totalprice: totalPrice, // Store the calculated total price
    });

    // Save the sale
    await newSale.save();

    // Return the newly created sale
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the sale. ' + error.message });
  }
};


// Get all sales and populate product and user details
exports.getAllSales = async (req, res) => {
    try {
      const sales = await Sale.find()
        .populate('productId')  
        .populate('userId'); 
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sales.' });
    }
  };
  
// Get a single sale by ID and populate product and user details
exports.getSaleById = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('productId') 
        .populate('userId');  
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found.' });
      }
      res.status(200).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the sale.' });
    }
  };

  
  
  



  exports.updateSale = async (req, res) => {
    try {
      const { saleId } = req.params; 
      const { productId, userId, quantity, supplements, size } = req.body;
  
    
      // Fetch the sale details by ID
      const sale = await Sale.findById(req.params.id) //saleId
      .populate('productId') 
      .populate('userId');  
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found.' });
      }
  
      // Fetch the product details based on the selected productId
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Ensure the size exists in the product sizes (small, medium, large)
      if (!product.sizes[size]) {
        return res.status(400).json({ error: 'Invalid size selected.' });
      }
  
      // Fetch the supplement details (if any)
      let totalSupplementPrice = 0;
      if (supplements && supplements.length > 0) {
        const supplementsDetails = await Supplement.find({ _id: { $in: supplements } });
        totalSupplementPrice = supplementsDetails.reduce((total, supplement) => total + supplement.price, 0);
  
        // Ensure all provided supplement IDs are valid
        if (supplementsDetails.length !== supplements.length) {
          return res.status(400).json({ error: 'One or more supplements are invalid.' });
        }
      }
  
      // Calculate the total price:
      const totalPrice = (product.sizes[size].price + totalSupplementPrice) * quantity;
  
      // Update the sale with the new values
      sale.productId = productId;
      sale.userId = userId;
      sale.quantity = quantity;
      sale.supplements = supplements; // Update supplements
      sale.totalprice = totalPrice; // Store the recalculated total price
  
      // Save the updated sale
      await sale.save();
  
      // Return the updated sale
      res.status(200).json(sale);
    } catch (error) {
      console.error('Error updating sale:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to update the sale.' });
    }
  };
  
  
//deleteSale
  exports.deleteSale = async (req, res) => {
    try {
      const { id } = req.params; // Get sale ID from the request parameters
  
      // Find and delete the sale by ID
      const sale = await Sale.findByIdAndDelete(id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found.' });
      }
  
      // Return a success message
      res.status(200).json({ message: 'Sale deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the sale.' });
    }
  };
  

/* //updateSale
  exports.updateSale = async (req, res) => {
    try {
      const { id } = req.params; 
      console.log('ID from params:', id); // Debug log
      
      const { productId, userId, quantity, totalprice  } = req.body;
  
      // Fetch the sale details by ID
      const sale = await Sale.findById(id);
    if (!sale) {
      console.log('Sale not found'); // Debug log
      return res.status(404).json({ error: 'Sale not found.' });
    }
  
     
  
      // Update the sale details
      sale.productId = productId;
      sale.userId = userId;
      sale.quantity = quantity;
      sale.totalprice  = totalprice  
  
      // Save the updated sale
      await sale.save();
  
      // Return the updated sale
      res.status(200).json(sale);
    } catch (error) {
      console.error('Error:', error); // Log error for debugging
      res.status(500).json({ error: 'Failed to update the sale.' });
    }
  };
   */