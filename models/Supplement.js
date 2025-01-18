const mongoose = require('mongoose');

const supplementSchema = new mongoose.Schema(
 
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      calories: { type: Number }
    }
 
);


module.exports = mongoose.model('Supplement', supplementSchema);
