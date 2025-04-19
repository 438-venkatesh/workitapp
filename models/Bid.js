const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Publisher's ID
  bidAmount: { type: Number, required: true },
  
  bidDescription: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  freezed: { type: Boolean, default: false }, // New field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bid', bidSchema);
