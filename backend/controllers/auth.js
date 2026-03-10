const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../services/authService');
const { logAudit } = require('../services/auditService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role, studentIds } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'parent',
    studentIds: studentIds || []
  });

  await logAudit({
    action: 'user_register',
    category: 'auth',
    resourceType: 'User',
    resourceId: user._id.toString(),
    req,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    await logAudit({
      action: 'user_login_failed',
      category: 'auth',
      status: 'failure',
      metadata: { email },
      req,
    });
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    await logAudit({
      action: 'user_login_failed',
      category: 'auth',
      status: 'failure',
      resourceType: 'User',
      resourceId: user._id.toString(),
      req,
    });
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  await logAudit({
    action: 'user_login_success',
    category: 'auth',
    resourceType: 'User',
    resourceId: user._id.toString(),
    req,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('studentIds');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    await logAudit({
      action: 'user_change_password_failed',
      category: 'auth',
      status: 'failure',
      resourceType: 'User',
      resourceId: user._id.toString(),
      req,
    });
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  await logAudit({
    action: 'user_change_password',
    category: 'auth',
    resourceType: 'User',
    resourceId: user._id.toString(),
    req,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (uses refresh token cookie)
exports.refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return next(new ErrorResponse('Refresh token missing', 401));
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    return next(new ErrorResponse('Invalid refresh token', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 401));
  }

  await logAudit({
    action: 'user_token_refresh',
    category: 'auth',
    resourceType: 'User',
    resourceId: user._id.toString(),
    req,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (clears cookies if present)
exports.logout = asyncHandler(async (req, res) => {
  await logAudit({
    action: 'user_logout',
    category: 'auth',
    resourceType: 'User',
    resourceId: req.user ? req.user._id.toString() : undefined,
    req,
  });
  clearAuthCookies(res);
  res.status(200).json({ success: true });
});

// Issue tokens, set cookies, and return safe user payload
const sendTokenResponse = (user, statusCode, res) => {
  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  setAuthCookies(res, accessToken, refreshToken);

  // Keep response backward compatible with existing frontend (token in body)
  res.status(statusCode).json({
    success: true,
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
