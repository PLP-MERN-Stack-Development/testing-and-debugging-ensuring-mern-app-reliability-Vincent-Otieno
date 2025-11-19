const { body, param, query, validationResult } = require('express-validator');
const { isValidObjectId } = require('../utils/validation');

/**
 * Handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for creating a post
 */
const validatePost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid category ID');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  validate,
];

/**
 * Validation rules for updating a post
 */
const validatePostUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
  body('category')
    .optional()
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid category ID');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  validate,
];

/**
 * Validation rules for MongoDB ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    }),
  validate,
];

/**
 * Validation rules for pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validatePost,
  validatePostUpdate,
  validateObjectId,
  validatePagination,
};
