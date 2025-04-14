// utils/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  },
  tls: {
    rejectUnauthorized: false // Only for testing, remove in production
  }
});

const sendVerificationEmail = async (toEmail, token, username) => {
  try {
    const verificationUrl = `http://192.168.188.237:5000/api/auth/verify-email/${token}`;
// Note: Added '/api/auth' to match typical Express route structure
    
    await transporter.sendMail({
      from: `"Your App Name" <${config.email.from}>`,
      to: toEmail,
      subject: 'Verify Your Email',
      html: `<p>Hello ${username},</p>
             <p>Please verify your email by clicking this link:</p>
             <a href="${verificationUrl}">Verify Email</a>`
    });
    
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Email sending error:', {
      error: error.message,
      config: config.email.auth.user ? 'Config loaded' : 'Config missing'
    });
    throw error;
  }
};

module.exports = sendVerificationEmail;