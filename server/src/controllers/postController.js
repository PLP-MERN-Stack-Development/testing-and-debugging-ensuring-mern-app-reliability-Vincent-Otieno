const Post = require('../models/Post');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { validatePagination } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Get all posts with pagination and filtering
 * GET /api/posts
 */
const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, category, author, status, search } = req.query;

  // Validate and set pagination
  const { page: validPage, limit: validLimit, skip } = validatePagination(page, limit);

  // Build query
  const query = {};

  if (category) {
    query.category = category;
  }

  if (author) {
    query.author = author;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query
  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'username email profile')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit),
    Post.countDocuments(query),
  ]);

  res.json({
    posts,
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      pages: Math.ceil(total / validLimit),
    },
  });
});

/**
 * Get a single post by ID
 * GET /api/posts/:id
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username email profile')
    .populate('category', 'name slug')
    .populate('comments.user', 'username profile');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json(post);
});

/**
 * Create a new post
 * POST /api/posts
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, status, featuredImage } = req.body;

  const post = await Post.create({
    title,
    content,
    category,
    tags,
    status,
    featuredImage,
    author: req.userId,
  });

  const populatedPost = await Post.findById(post._id)
    .populate('author', 'username email')
    .populate('category', 'name slug');

  logger.info(`New post created: ${post.title} by user ${req.userId}`);

  res.status(201).json(populatedPost);
});

/**
 * Update a post
 * PUT /api/posts/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Check if user is the author
  if (post.author.toString() !== req.userId.toString()) {
    throw new ApiError(403, 'You can only update your own posts');
  }

  // Update fields
  const allowedUpdates = ['title', 'content', 'category', 'tags', 'status', 'featuredImage'];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate('author', 'username email')
    .populate('category', 'name slug');

  logger.info(`Post updated: ${post.title} by user ${req.userId}`);

  res.json(updatedPost);
});

/**
 * Delete a post
 * DELETE /api/posts/:id
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.userId.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only delete your own posts');
  }

  await Post.findByIdAndDelete(req.params.id);

  logger.info(`Post deleted: ${post.title} by user ${req.userId}`);

  res.json({
    message: 'Post deleted successfully',
  });
});

/**
 * Like a post
 * POST /api/posts/:id/like
 */
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Check if already liked
  const alreadyLiked = post.likes.some((like) => like.toString() === req.userId.toString());

  if (alreadyLiked) {
    // Unlike
    post.likes = post.likes.filter((like) => like.toString() !== req.userId.toString());
  } else {
    // Like
    post.likes.push(req.userId);
  }

  await post.save();

  res.json({
    message: alreadyLiked ? 'Post unliked' : 'Post liked',
    likes: post.likes.length,
  });
});

/**
 * Add a comment to a post
 * POST /api/posts/:id/comments
 */
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, 'Comment content is required');
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  post.comments.push({
    user: req.userId,
    content: content.trim(),
  });

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate('comments.user', 'username profile');

  res.status(201).json({
    message: 'Comment added successfully',
    comments: updatedPost.comments,
  });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
};
