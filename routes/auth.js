const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// routes/auth.js
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if user already exists (verified)
    const existingUser = await User.findOne({ email: decoded.email, isVerified: true });
    if (existingUser) {
      return res.send(`
        <html>
        <body>
          <p>Email already verified. <a href="/login">Go to Login</a></p>
        </body>
        </html>
      `);
    }

    // Create and save the user
    const user = new User({ 
      username: decoded.username, 
      email: decoded.email, 
      password: decoded.password,
      isVerified: true 
    });
    await user.save();

    res.send(`
      <html>
      <body>
        <p>Email verified successfully. <a href="/login">Go to Login</a></p>
      </body>
      </html>
    `);

  } catch (error) {
    res.status(400).send(`
      <html>
      <body>
        <p>Verification failed. <a href="/resend-verification">Get new verification link</a></p>
      </body>
      </html>
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
