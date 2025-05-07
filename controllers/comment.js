import Comment from '../models/comment.js';
import Blog from '../models/blog.js';

// @desc    Create a new comment
// @route   POST /api/blogs/:blogId/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Create comment
    const comment = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      blog: req.params.blogId,
      isReply: false,
    });
    
    // Populate user data
    await comment.populate('user', 'name username profilePicture');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all comments for a blog
// @route   GET /api/blogs/:blogId/comments
// @access  Public
export const getCommentsByBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Get only top-level comments (not replies)
    const comments = await Comment.find({ 
      blog: req.params.blogId,
      isReply: false
    })
    .populate('user', 'name username profilePicture')
    .populate({
      path: 'replies',
      populate: {
        path: 'user',
        select: 'name username profilePicture'
      }
    })
    .sort({ createdAt: -1 });
    
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Public
export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('user', 'name username profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'name username profilePicture'
        }
      });
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = req.body.content;
    comment.isEdited = true;
    
    await comment.save();
    
    // Populate user data
    await comment.populate('user', 'name username profilePicture');
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment or admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Delete all replies to this comment
    if (!comment.isReply) {
      await Comment.deleteMany({ parent: comment._id });
    }
    
    // Delete the comment
    await comment.deleteOne();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a reply to a comment
// @route   POST /api/comments/:commentId/replies
// @access  Private
export const replyToComment = async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Create reply
    const reply = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      blog: parentComment.blog,
      parent: req.params.commentId,
      isReply: true,
    });
    
    // Populate user data
    await reply.populate('user', 'name username profilePicture');
    
    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get replies for a comment
// @route   GET /api/comments/:commentId/replies
// @access  Public
export const getRepliesByComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const replies = await Comment.find({ 
      parent: req.params.commentId 
    })
    .populate('user', 'name username profilePicture')
    .sort({ createdAt: -1 });
    
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
