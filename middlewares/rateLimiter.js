// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Limit sensitive endpoints like OTP and login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests
  message: {
    success: false,
    message: 'Too many attempts, please try again later',
  },
});

module.exports = { authLimiter };
