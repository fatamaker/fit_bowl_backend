const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    model3d: { type: String },
    reference: { type: String, unique: true },
    description: { type: String },
    category: { type: String , required: true  },
    SuppId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplement'}],
    sizes: { // Nested object for sizes
      small: {
        price: { type: Number, required: true },
        calories: { type: Number }
      },
      medium: {
        price: { type: Number, required: true },
        calories: { type: Number  }
      },
      large: {
        price: { type: Number, required: true },
        calories: { type: Number }
      }
    },
  
  }, { timestamps: true });
  
  module.exports = mongoose.model('Product', ProductSchema);
  