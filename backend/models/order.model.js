const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store:    { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },

  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      { type: String },
    price:     { type: Number },
    qty:       { type: Number },
    imageUrl:  { type: String }
  }],

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'unsuccessful', 'cancelled'],
    default: 'pending'
  },

  placed: { type: Boolean, default: false },

  courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  address: { type: String, default: '' },
  deliveryLat: { type: Number, default: null },
  deliveryLng: { type: Number, default: null },

  courierLat: { type: Number, default: null },
  courierLng: { type: Number, default: null },
  courierLocationUpdatedAt: { type: Date, default: null },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);