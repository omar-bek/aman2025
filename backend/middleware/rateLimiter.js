const rateLimit = require('express-rate-limit');

// Generic helper to build a limiter
const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.',
    },
  });

// Stricter limiter for auth-related routes
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many login attempts, please try again later.',
});

module.exports = {
  authLimiter,
  createLimiter,
};

