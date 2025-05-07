import Like from '../models/like.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';

// @desc    Like a blog
// @route   POST /api/blogs/:blogId/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if the user has already liked this blog
    const existingLike = await Like.findOne({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }
    
    // Create like
    const like = await Like.create({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    // Get updated count
    const likesCount = await Like.countDocuments({ blog: req.params.blogId });
    
    res.status(201).json({ 
      message: 'Blog liked successfully',
      likesCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Unlike a blog
// @route   DELETE /api/blogs/:blogId/like
// @access  Private
export const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Find and remove the like
    const removedLike = await Like.findOneAndDelete({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    if (!removedLike) {
      return res.status(400).json({ message: 'You have not liked this blog' });
    }
    
    // Get updated count
    const likesCount = await Like.countDocuments({ blog: req.params.blogId });
    
    res.status(200).json({ 
      message: 'Blog unliked successfully',
      likesCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get likes for a blog
// @route   GET /api/blogs/:blogId/likes
// @access  Public
export const getBlogLikes = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const likes = await Like.find({ blog: req.params.blogId })
      .populate('user', 'name username profilePicture');
    
    res.status(200).json({
      count: likes.length,
      likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a comment
// @route   POST /api/comments/:commentId/like
// @access  Private
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if the user has already liked this comment
    const existingLike = await Like.findOne({
      user: req.user._id,
      comment: req.params.commentId,
    });
    
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this comment' });
    }
    
    // Create like
    const like = await Like.create({
      user: req.user._id,
      comment: req.params.commentId,
    });
    
    // Get updated count
    const likesCount = await Like.countDocuments({ comment: req.params.commentId });
    
    res.status(201).json({ 
      message: 'Comment liked successfully',
      likesCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Unlike a comment
// @route   DELETE /api/comments/:commentId/like
// @access  Private
export const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Find and remove the like
    const removedLike = await Like.findOneAndDelete({
      user: req.user._id,
      comment: req.params.commentId,
    });
    
    if (!removedLike) {
      return res.status(400).json({ message: 'You have not liked this comment' });
    }
    
    // Get updated count
    const likesCount = await Like.countDocuments({ comment: req.params.commentId });
    
    res.status(200).json({ 
      message: 'Comment unliked successfully',
      likesCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get likes for a comment
// @route   GET /api/comments/:commentId/likes
// @access  Public
export const getCommentLikes = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const likes = await Like.find({ comment: req.params.commentId })
      .populate('user', 'name username profilePicture');
    
    res.status(200).json({
      count: likes.length,
      likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
