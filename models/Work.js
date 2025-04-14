const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Publisher's ID
  frozen: { type: Boolean, default: false }, // Whether the work is frozen (hidden)
  isAllocated: { type: Boolean, default: false }, // Whether the work is allocated to a bidder
  status: { type: String, enum: ['pending', 'ongoing', 'completed', 'rejected'], default: 'pending' }, // Work status
  winningBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Winning bidder's ID
  winningBidAmount: { type: Number }, // Winning bid amount
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Work', workSchema);