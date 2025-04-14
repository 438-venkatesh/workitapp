const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id'); // Fetch only username and _id
    res.json(users); // Send JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send JSON error
  }
});

// Other routes
router.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { instituteName, idNumber, year, branch } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { instituteName, idNumber, year, branch },
      { new: true }
    );
    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.post('/register', async (req, res) => {
  const { username, email, password, instituteName, idNumber, year, branch } = req.body;

  try {
    const user = new User({
      username,
      email,
      password,
      instituteName,
      idNumber,
      year,
      branch,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Add this new route to get basic user info (username and email)
router.get('/user/basic/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, 'username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update the existing get user route to exclude password
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;