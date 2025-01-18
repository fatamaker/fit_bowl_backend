
const Product = require('../models/Product');



exports.createProduct = async (req, res) => {
  try {
    const { name, image, model3d, reference, description, category,SuppId, sizes } = req.body;

    // Validate if the SuppId is an array and not empty
    if (!Array.isArray(SuppId) || SuppId.length === 0) {
      return res.status(400).json({ error: 'SuppId must be a non-empty array of ObjectIds.' });
    }

    // Create the new product
    const newProduct = new Product({ name, image, model3d, reference, description, category,SuppId, sizes });

    // Save the product
    await newProduct.save();

    // Send response
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the product.' + error });
  }
};




// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('SuppId').sort({createdAt:-1});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// Get soretd products
exports.getSortedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({sales:-1});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// Get  single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('SuppId');
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the product.' });
  }
};

// Update 
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the product.' });
  }
};

// Delete a product 
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({"_id":req.params.id});
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the product.' });
  }
};


// get by category 
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ "category":category});
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category.' });
  }
};




















   