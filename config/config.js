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
        user: 'workitrgukt@gmail.com',
        pass: 'rypk vatf vizn vyhn'
      },
      from: 'workitrgukt@gmail.com'
    }
  };
  
