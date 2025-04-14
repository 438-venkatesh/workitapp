const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient user ID
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who triggered the notification
  message: { type: String, required: true },
  type: { type: String, enum: ['work_published', 'bid_received', 'work_completed'], default: 'work_published' },
  isRead: { type: Boolean, default: false },
  relatedWork: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' }, // Reference to related work if any
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);