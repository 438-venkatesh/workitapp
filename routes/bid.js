const express = require('express');
const Bid = require('../models/Bid');
const Work = require('../models/Work'); // Ensure Work model is imported
const router = express.Router();

// Submit a bid
router.post('/bids', async (req, res) => {
  const { bidId, userId, bidAmount, bidDescription ,publisherId} = req.body;
  try {
    const bid = new Bid({ bidId, userId,publisherId, bidAmount, deliveryDays, bidDescription });
    await bid.save();
    res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get bids for a specific work
router.get('/bids/:workId', async (req, res) => {
  const { workId } = req.params;
  try {
    const bids = await Bid.find({ bidId: workId }).populate('userId', 'username email'); // Populate user details
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/bids/:bidId/accept', async (req, res) => {
  const { bidId } = req.params;
  try {
    // Update the bid status to "accepted"
    const bid = await Bid.findByIdAndUpdate(bidId, { status: 'accepted' }, { new: true });

    // Freeze the corresponding work and mark it as allocated
    await Work.findByIdAndUpdate(bid.bidId, { frozen: true, isAllocated: true,winningBidder: bid.userId, winningBidAmount: bid.bidAmount }); 

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bids submitted by a specific user
router.get('/bids/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const bids = await Bid.find({ userId }).populate('bidId', 'title');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
