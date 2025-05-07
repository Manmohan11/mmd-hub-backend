import Bookmark from '../models/bookmark.js';
import Blog from '../models/blog.js';

// @desc    Bookmark a blog
// @route   POST /api/blogs/:blogId/bookmark
// @access  Private
export const bookmarkBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if the user has already bookmarked this blog
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    if (existingBookmark) {
      return res.status(400).json({ message: 'Blog already bookmarked' });
    }
    
    // Create bookmark
    const bookmark = await Bookmark.create({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    res.status(201).json({ 
      message: 'Blog bookmarked successfully',
      bookmark,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/blogs/:blogId/bookmark
// @access  Private
export const removeBookmark = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Find and remove the bookmark
    const removedBookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      blog: req.params.blogId,
    });
    
    if (!removedBookmark) {
      return res.status(400).json({ message: 'Blog not bookmarked' });
    }
    
    res.status(200).json({ 
      message: 'Bookmark removed successfully',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get bookmarks for a user
// @route   GET /api/users/:userId/bookmarks
// @access  Private
export const getUserBookmarks = async (req, res) => {
  try {
    // Ensure the user is accessing their own bookmarks or is an admin
    if (req.params.userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access these bookmarks' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Bookmark.countDocuments({ user: req.params.userId });
    
    const bookmarks = await Bookmark.find({ user: req.params.userId })
      .populate({
        path: 'blog',
        populate: {
          path: 'author',
          select: 'name username profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      bookmarks,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
