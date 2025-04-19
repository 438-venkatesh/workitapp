const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

const User = require('../models/User');
const sendVerificationEmail = require('../utils/emailService');



// routes/auth.js
const config = require('../config/config');
const jwt = require('jsonwebtoken');
router.post('/register', authController.register);
router.post('/login', authController.login);
// Add this new endpoint to handle verification completion
router.post('/complete-registration', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if user exists (temporary check)
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create and save the user
    const user = new User({
      username: decoded.username,
      email: decoded.email,
      password: decoded.password,
      isVerified: true
    });
    
    await user.save();
    
    // Generate auth token
    const authToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '7d' });
    
    res.json({
      token: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: true
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// In your resend verification route
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    const verificationToken = jwt.sign(
      { userId: user._id },
      config.jwt.secret, // Using config instead of process.env
      { expiresIn: config.jwt.expiresIn }
    );
    
    await sendVerificationEmail(user.email, verificationToken, user.username);
    
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error resending verification email:', {
      error: error.message,
      stack: error.stack,
      config: config.jwt // Log current config for debugging
    });
    res.status(500).json({ 
      error: 'Server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});
// Email Verification Route
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send(`
        <h1>Verification Failed</h1>
        <p>User not found</p>
        <a href="/">Return to home</a>
      `);
    }

    if (user.isVerified) {
      return res.send(`
        <h1>Already Verified</h1>
        <p>Your email was already verified</p>
        <a href="/login">Proceed to login</a>
      `);
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

   res.send(`
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
    .success { color: #4CAF50; font-size: 24px; }
    .btn { 
      display: inline-block; 
      padding: 10px 20px; 
      background-color: #3b82f6; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px;
      margin-top: 20px;
      cursor: pointer;
    }
    .message {
      margin-top: 20px;
      color: #333;
      font-size: 18px;
      display: none;
    }
  </style>

  <div class="success">✓ Email Verified Successfully</div>
  <p>You can now log in to your account</p>
  <a href="/login" class="btn" onclick="showMessage()">Go to Login</a>
  <div id="extraMessage" class="message">Go to WorkIt App and login with your credentials</div>

  <script>
    function showMessage() {
      document.getElementById('extraMessage').style.display = 'block';
    }
  </script>
`);


  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).send(`
      <h1>Verification Failed</h1>
      <p>${error.message.includes('expired') ? 
        'Verification link expired' : 
        'Invalid verification link'}</p>
      <a href="/resend-verification">Click here to get a new verification email</a>
    `);
  }
});
module.exports = router;
