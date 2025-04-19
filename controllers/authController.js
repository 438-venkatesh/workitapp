const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Create a temporary user object but don't save it yet
    const tempUser = new User({ username, email, password });
    
    // Generate verification token
    const verificationToken = jwt.sign(
      { email: tempUser.email }, 
      'your_jwt_secret', 
      { expiresIn: '24h' }
    );
    
    // Send verification email
    await sendVerificationEmail(tempUser.email, verificationToken, tempUser.username);
    
    res.status(201).json({
      message: 'Verification email sent. Please verify your email to complete registration.',
      email: tempUser.email
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        instituteName: user.instituteName,
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
