const config = require('../config/config');

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== config.apiKeys.mobile) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next();
};

const validateOrigin = (req, res, next) => {
  const allowedOrigins = ['http://localhost', 'http://192.168.188.237'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    return next();
  }
  
  // Allow requests from mobile apps (no origin header)
  if (!origin && req.headers['user-agent']?.includes('YourAppName')) {
    return next();
  }
  
  return res.status(403).json({ error: 'Access denied' });
};

module.exports = { apiKeyAuth, validateOrigin };