const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/emailService');
const config = require('../config/config');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists (unverified or verified)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      // If unverified user exists, delete it to create a new one
      await User.deleteOne({ email });
    }

    // Create verification token
    const verificationToken = jwt.sign(
      { username, email, password },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken, username);

    res.status(200).json({ 
      message: 'Verification email sent. Please verify your email to complete registration.',
      email 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyAndCreateUser = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret);
    const { username, email, password } = decoded;

    // Check if user already exists (verified)
    const existingUser = await User.findOne({ email, isVerified: true });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already verified and registered' });
    }

    // Create and save the user
    const user = new User({ 
      username, 
      email, 
      password,
      isVerified: true 
    });
    await user.save();

    // Generate auth token
    const authToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });

    res.json({
      token: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        instituteName: user.instituteName,
        isVerified: user.isVerified
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, verifyAndCreateUser };
