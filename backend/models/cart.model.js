const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  store:     { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  imageUrl:  { type: String, default: '' },
  qty:       { type: Number, default: 1 }
});

module.exports = mongoose.model('Cart', cartSchema);