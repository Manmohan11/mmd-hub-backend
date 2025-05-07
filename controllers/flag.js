import Flag from '../models/flag.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';

// @desc    Flag a blog or comment
// @route   POST /api/flags
// @access  Private
export const createFlag = async (req, res) => {
  try {
    const { blogId, commentId, reason, details } = req.body;
    
    // Validate that either blogId or commentId is provided but not both
    if ((blogId && commentId) || (!blogId && !commentId)) {
      return res.status(400).json({ 
        message: 'Please provide either a blog ID or comment ID to flag, but not both or neither' 
      });
    }
    
    // Check if the blog or comment exists
    if (blogId) {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    }
    
    if (commentId) {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
    }
    
    // Check if the user has already flagged this content
    const existingFlag = await Flag.findOne({
      user: req.user._id,
      ...(blogId ? { blog: blogId } : { comment: commentId }),
    });
    
    if (existingFlag) {
      return res.status(400).json({ 
        message: `You have already flagged this ${blogId ? 'blog' : 'comment'}` 
      });
    }
    
    // Create flag
    const flag = await Flag.create({
      user: req.user._id,
      reason,
      details,
      ...(blogId ? { blog: blogId } : { comment: commentId }),
    });
    
    // Populate user data
    await flag.populate('user', 'name username');
    
    res.status(201).json({
      message: `${blogId ? 'Blog' : 'Comment'} has been flagged for review`,
      flag,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all flags
// @route   GET /api/flags
// @access  Private/Admin
export const getFlags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by status if provided
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const total = await Flag.countDocuments(query);
    
    const flags = await Flag.find(query)
      .populate('user', 'name username profilePicture')
      .populate('blog', 'title')
      .populate('comment', 'content')
      .populate('reviewedBy', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      flags,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flag by ID
// @route   GET /api/flags/:id
// @access  Private/Admin
export const getFlagById = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id)
      .populate('user', 'name username profilePicture')
      .populate({
        path: 'blog',
        populate: {
          path: 'author',
          select: 'name username'
        }
      })
      .populate({
        path: 'comment',
        populate: [
          {
            path: 'user',
            select: 'name username'
          },
          {
            path: 'blog',
            select: 'title'
          }
        ]
      })
      .populate('reviewedBy', 'name username');
    
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }
    
    res.status(200).json(flag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve flag
// @route   DELETE /api/flags/:id
// @access  Private/Admin
export const resolveFlag = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    
    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }
    
    // Update flag status and reviewer information
    flag.status = 'resolved';
    flag.reviewedBy = req.user._id;
    flag.reviewDate = Date.now();
    flag.reviewNotes = req.body.reviewNotes || 'Flag resolved';
    
    await flag.save();
    
    res.status(200).json({ 
      message: 'Flag resolved successfully',
      flag
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
