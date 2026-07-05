const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl:    { type: String, default: '' },
  approved:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  categories:  { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);