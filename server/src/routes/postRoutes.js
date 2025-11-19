const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  validatePost,
  validatePostUpdate,
  validateObjectId,
  validatePagination,
} = require('../middleware/validator');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination and filtering
 * @access  Public
 */
router.get('/', validatePagination, postController.getPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 */
router.get('/:id', validateObjectId(), postController.getPostById);

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post('/', authenticate, validatePost, postController.createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId(),
  validatePostUpdate,
  postController.updatePost
);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private
 */
router.delete('/:id', authenticate, validateObjectId(), postController.deletePost);

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like/unlike a post
 * @access  Private
 */
router.post('/:id/like', authenticate, validateObjectId(), postController.likePost);

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post(
  '/:id/comments',
  authenticate,
  validateObjectId(),
  [
    body('content')
      .trim()
      .notEmpty().withMessage('Comment content is required')
      .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
  ],
  postController.addComment
);

module.exports = router;
