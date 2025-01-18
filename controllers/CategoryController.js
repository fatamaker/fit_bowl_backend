const Category = require("../models/Category");

const createCategory =async (req,res)=>{
    const newCategory = new Category(req.body);
    try {
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (err) {
      res.status(500).json(err);
    }
  }
   
  const getCategoryById =async (req,res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
          return res.status(404).json({ error: 'category not found.' });
        }
        res.status(200).json(category);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the category.' });
      }
  }

  const getAllCategories =async (req,res)=>{
    try {
        const categories = await Category.find({}); // Exclude the password field
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching categories' });
      }
  }


  const updateCategory =async (req,res)=>{
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        if (!category) {
          return res.status(404).json({ error: 'category not found.' });
        }
        res.status(200).json(category);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update the category.' });
      }
  }

  const deleteCategory =async (req,res)=>{
    try {
        const category = await Category.findOneAndDelete({"_id":req.params.id});
        if (!category) {
          return res.status(404).json({ error: 'category not found.' });
        }
        res.status(200).json({ message: 'category deleted successfully.' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete the category.' });
      }
  }

module.exports = {
    createCategory,getCategoryById,updateCategory,deleteCategory,getAllCategories
}