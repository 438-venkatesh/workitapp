const express = require('express');
const Work = require('../models/Work');
const Notification = require('../models/Notification');
const User = require('../models/User');
const router = express.Router();



// In your Work.js backend routes
router.post('/publish', async (req, res) => {
  const { title, description, amount, category, userId } = req.body;
  
  // Validate input
  if (!title || !description || !amount || !category || !userId) {
    return res.status(400).json({ 
      error: 'All fields are required',
      details: { title, description, amount, category, userId }
    });
  }

  try {
    const work = new Work({ 
      title, 
      description, 
      amount: parseFloat(amount), 
      category, 
      userId 
    });
    
    await work.save();

    // Get publisher's username
    const publisher = await User.findById(userId).select('username');
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    
    // Get all users except the publisher
    const users = await User.find({ _id: { $ne: userId } }).select('_id');
    
    // Create notifications
    await Notification.insertMany(
      users.map(user => ({
        userId: user._id,
        senderId: userId,
        message: `${publisher.username} published: "${title}"`,
        type: 'work_published',
        relatedWork: work._id
      }))
    );

    return res.status(201).json({ 
      success: true,
      message: 'Work published successfully',
      workId: work._id
    });
    
  } catch (error) {
    console.error('Publish error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      time: new Date()
    });
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});
// Fetch all works (newly added)
router.get('/works', async (req, res) => {
  try {
    const works = await Work.find().populate('userId', 'username'); // Populate publisher info
    res.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/works/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const works = await Work.find({ userId }).populate('userId', 'username');

    if (!works || works.length === 0) {
      return res.status(404).json({ error: 'No works found for this user' });
    }

    res.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get works by category
router.get('/works/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const works = await Work.find({ category, frozen: false, isAllocated: false });
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In Work.js (backend routes)
router.put('/works/:workId/complete', async (req, res) => {
  const { workId } = req.params;
  try {
    const work = await Work.findByIdAndUpdate(
      workId,
      { status: 'completed' },
      { new: true }
    );
    res.json({ message: 'Work marked as completed', work });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// In Work.js (backend routes)
router.get('/works/completed/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const works = await Work.find({ userId, status: 'pending' });
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// In Work.js (backend routes)
router.put('/works/:workId/uncomplete', async (req, res) => {
  const { workId } = req.params;
  try {
    const work = await Work.findByIdAndUpdate(
      workId,
      { status: 'pending' },
      { new: true }
    );
    res.json({ message: 'Work marked as uncompleted', work });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;