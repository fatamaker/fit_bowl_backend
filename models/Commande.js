const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  salesID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
  totalAmount: { type: Number, required: true }, 
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
    default: 'pending', 
  },
  payment: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
    default:'Credit Card',
    required :true,
     
  },
  deliveryAddress:{type: String,required :true}
  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


