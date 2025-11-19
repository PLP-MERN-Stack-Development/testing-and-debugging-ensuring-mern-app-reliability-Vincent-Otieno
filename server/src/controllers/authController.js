const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, 'Email already registered');
    }
    if (existingUser.username === username) {
      throw new ApiError(409, 'Username already taken');
    }
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    profile,
  });

  // Generate token
  const token = generateToken(user);

  logger.info(`New user registered: ${user.username}`);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Account is inactive');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken(user);

  logger.info(`User logged in: ${user.username}`);

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
    },
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { profile } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { profile },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  logger.info(`User profile updated: ${user.username}`);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
  });
});

/**
 * Change password
 * PUT /api/auth/password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.username}`);

  res.json({
    message: 'Password changed successfully',
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
