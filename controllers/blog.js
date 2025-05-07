import Blog from '../models/blog.js';
import Comment from '../models/comment.js';

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    // Add author from authenticated user
    const blog = await Blog.create({
      ...req.body,
      author: req.body.author || req.user._id,
    });
    
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all blogs with pagination and search
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  console.log("req.query");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Only show published blogs for public
    let query = { status: 'published' };
    
    // Search functionality
    const searchQuery = req.query.search;
    
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by tag if provided
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    // Get blogs with pagination
    const blogs = await Blog.find(query)
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      blogs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blog by ID with comments
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name username profilePicture')
      .populate({
        path: 'comments',
        match: { isReply: false }, // Only top-level comments
        options: { sort: { createdAt: -1 } }
      });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if blog is published or user is author
    if (blog.status !== 'published' && (!req.user || blog.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied: Blog is not published' });
    }
    
    // Increment views count
    blog.views += 1;
    await blog.save();
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author of the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    // Don't allow status changes through this route
    if (req.body.status) {
      delete req.body.status;
    }
    
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author', 'name username profilePicture');
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author of the blog or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    // Delete all comments associated with this blog
    await Comment.deleteMany({ blog: req.params.id });
    
    // Delete the blog
    await blog.deleteOne();
    
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blogs by user
// @route   GET /api/users/:userId/blogs
// @access  Public
export const getBlogsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get blogs with pagination from specific user
    // If the requesting user is the same as the profile being viewed, show all blogs
    // Otherwise only show published blogs
    const query = { author: req.params.userId };
    
    if (!req.user || req.user._id.toString() !== req.params.userId.toString()) {
      query.status = 'published';
    }
    
    const total = await Blog.countDocuments(query);
    
    const blogs = await Blog.find(query)
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      blogs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review a blog (approve or reject)
// @route   PUT /api/blogs/:id/review
// @access  Private/Admin
export const reviewBlog = async (req, res) => {
  try {
    const { status, reviewComments } = req.body;
    
    if (!status || !['published', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Update blog with review details
    blog.status = status;
    blog.reviewComments = reviewComments || '';
    blog.reviewedBy = req.user._id;
    blog.reviewDate = Date.now();
    
    await blog.save();
    
    res.status(200).json({
      message: `Blog has been ${status === 'published' ? 'approved and published' : 'rejected'}`,
      blog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};