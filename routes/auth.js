const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// routes/auth.js
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const response = await authController.verifyAndCreateUser(req, res);
    
    if (!res.headersSent) {
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
          }
        </style>
        <div class="success">✓ Email Verified Successfully</div>
        <p>You can now log in to your account</p>
        <a href="/login" class="btn">Go to Login</a>
      `);
    }
  } catch (error) {
    res.status(400).send(`
      <h1>Verification Failed</h1>
      <p>${error.message.includes('expired') ? 
        'Verification link expired' : 
        'Invalid verification link'}</p>
      <a href="/resend-verification">Click here to get a new verification email</a>
    `);
  }
});


// Resend verification email route
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists and is already verified
    const user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Create new verification token
    const verificationToken = jwt.sign(
      { email },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    
    await sendVerificationEmail(email, verificationToken);
    
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ 
      error: 'Server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

module.exports = router;
