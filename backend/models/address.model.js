const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label:     { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  customLabel: { type: String, default: '' },
  fullAddress: { type: String, required: true },
  lat:       { type: Number, required: true },
  lng:       { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);