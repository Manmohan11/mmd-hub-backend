import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  reviewBlog
} from '../controllers/blog.js';
import {
  createComment,
  getCommentsByBlog
} from '../controllers/comment.js';
import {
  likeBlog,
  unlikeBlog,
  getBlogLikes
} from '../controllers/like.js';
import {
  bookmarkBlog,
  removeBookmark
} from '../controllers/bookmark.js';

const router = express.Router();

// Base route: /api/blogs

// Create a new blog and get all blogs
router.route('/')
  .post(createBlog)
  .get(getBlogs);

// Get, update, delete blog by ID
router.route('/:id')
  .get(getBlogById)
  .put(updateBlog)
  .delete(deleteBlog);

// Review a blog
router.route('/:id/review')
  .put(reviewBlog);

// Blog comments
router.route('/:blogId/comments')
  .post(createComment)
  .get(getCommentsByBlog);

// Like/unlike a blog
router.route('/:blogId/like')
  .post(likeBlog)
  .delete(unlikeBlog);

// Get likes for a blog
router.route('/:blogId/likes')
  .get(getBlogLikes);

// Bookmark/remove bookmark
router.route('/:blogId/bookmark')
  .post(bookmarkBlog)
  .delete(removeBookmark);

export default router;