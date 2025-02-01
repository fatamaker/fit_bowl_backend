const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  totalprice: { type: Number},
  supplements: [{ type: String}],
  totalCalories:{ type: Number},
 
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);

