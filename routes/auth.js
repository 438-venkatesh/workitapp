const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// routes/auth.js
router.post('/register', authController.register);
router.post('/login', authController.login);

// In your auth.js file, update the verify-email route
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if user already exists (verified)
    const existingUser = await User.findOne({ email: decoded.email, isVerified: true });
    if (existingUser) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Already Verified</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              background-color: #f8f9fa;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .success-icon {
              color: #4CAF50;
              font-size: 60px;
              margin-bottom: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            p {
              color: #666;
              font-size: 18px;
              margin-bottom: 30px;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              transition: background-color 0.3s;
            }
            .btn:hover {
              background-color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Email Already Verified</h1>
            <p>Your email address was already verified. You can now log in to your account.</p>
            <a href="/login" class="btn">Go to Login</a>
          </div>
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
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .success-icon {
            color: #4CAF50;
            font-size: 60px;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 18px;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✓</div>
          <h1>Email Verified Successfully!</h1>
          <p>Thank you for verifying your email address. Your account has been successfully created.</p>
          <a href="/login" class="btn">Continue to Login</a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Verification error:', error); // This is for server logs
    
    let errorMessage = 'Invalid verification link';
    if (error.message.includes('expired')) {
      errorMessage = 'Verification link has expired. Please request a new verification email.';
    } else if (error.message.includes('invalid signature')) {
      errorMessage = 'Invalid verification link. Please check the link or request a new one.';
    }

    res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Failed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .error-icon {
            color: #ef4444;
            font-size: 60px;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 18px;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">✕</div>
          <h1>Verification Failed</h1>
          <p>${errorMessage}</p>
          <a href="/resend-verification" class="btn">Request New Verification Email</a>
        </div>
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
