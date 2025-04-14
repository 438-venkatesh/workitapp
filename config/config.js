// config/config.js
module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET || 'default_secret_key',
      expiresIn: '1h' // or whatever duration you want
    },
    email: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'n210438@rguktn.ac.in',
        pass: 'miec nsnb xfdl geyu'
      },
      from: 'n210438@rguktn.ac.in'
    }
  };
  