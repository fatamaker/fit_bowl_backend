const mongoose = require("mongoose");

const ListSchema= new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });



module.exports = mongoose.model("wishlsit", ListSchema);