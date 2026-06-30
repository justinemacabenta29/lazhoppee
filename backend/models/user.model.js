const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'customer', 'store_owner'], default: 'customer' },
  storeApproved: { type: Boolean, default: false } // only relevant for store_owner
});

module.exports = mongoose.model('User', userSchema);