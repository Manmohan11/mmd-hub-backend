import express from 'express';
import {
  getCommentById,
  updateComment,
  deleteComment,
  replyToComment,
  getRepliesByComment
} from '../controllers/comment.js';
import {
  likeComment,
  unlikeComment,
  getCommentLikes
} from '../controllers/like.js';

const router = express.Router();

// Base route: /api/comments

// Get, update, delete comment by ID
router.route('/:id')
  .get(getCommentById)
  .put(updateComment)
  .delete(deleteComment);

// Comment replies
router.route('/:commentId/replies')
  .post(replyToComment)
  .get(getRepliesByComment);

// Like/unlike a comment
router.route('/:commentId/like')
  .post(likeComment)
  .delete(unlikeComment);

// Get likes for a comment
router.route('/:commentId/likes')
  .get(getCommentLikes);

export default router;
