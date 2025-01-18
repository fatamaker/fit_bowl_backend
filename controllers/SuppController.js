const Supplement = require('../models/Supplement');

// Create a new Supplement
exports.createSupplement = async (req, res) => {
  try {
    const newSupplement = new Supplement(req.body);
    await newSupplement.save();
    res.status(201).json(newSupplement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the Supplement.' + error });
  }
};

// Get all Supplements
exports.getAllSupplements = async (req, res) => {
    try {
      const supplements = await Supplement.find();
      res.status(200).json(supplements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supplements.' });
    }
  };
  


// Get a single Supplement by ID
exports.getSupplementById = async (req, res) => {
  try {
    const supplement = await Supplement.findById(req.params.id);
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found.' });
    }
    res.status(200).json(supplement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the Supplement.' });
  }
};

// Update a Supplement
exports.updateSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found.' });
    }
    res.status(200).json(supplement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the Supplement.' });
  }
};

// Delete a Supplement
exports.deleteSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findOneAndDelete({ _id: req.params.id });
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found.' });
    }
    res.status(200).json({ message: 'Supplement deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the Supplement.' });
  }
};
