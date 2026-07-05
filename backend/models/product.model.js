const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  imageUrl:    { type: String, default: '' },
  description: { type: String, default: '' },
  category:    { 
    type: String, 
    enum: ['shoes', 'pants', 'tshirt', 'hoodie', 'accessories'],
    default: 'shoes' 
  },
  stock:       { type: Number, default: 10 },
  rating:      { type: Number, default: 4.5 },
  sold:        { type: Number, default: 0 },
  store:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  approved:    { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);