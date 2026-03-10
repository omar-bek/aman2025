const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  refresh,
  logout,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/register',
  authLimiter,
  [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').isString().trim().notEmpty(),
    body('password').isString().isLength({ min: 6 }),
    body('role').optional().isString(),
  ],
  validateRequest,
  register,
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').optional().isString().trim(),
    body('username').optional().isString().trim(),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errors = [];
    const loginId = (req.body.email || req.body.username || '').trim();
    if (!loginId) {
      errors.push({ field: 'email', message: 'Email or username is required' });
    }
    if (!req.body.password || !String(req.body.password).trim()) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    req.body.email = loginId;
    next();
  },
  login,
);

router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 6 }),
  ],
  validateRequest,
  changePassword,
);

module.exports = router;
