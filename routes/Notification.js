const express = require('express');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const router = express.Router();

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'username')
      .populate('relatedWork', 'title');
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Other notification routes (mark as read, etc.)...
module.exports = router;