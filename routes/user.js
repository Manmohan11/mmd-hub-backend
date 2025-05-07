import express from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/user.js';
import { getBlogsByUser } from '../controllers/blog.js';
import { getUserBookmarks } from '../controllers/bookmark.js';
import { getDraftsByUser } from '../controllers/draft.js';

const router = express.Router();

// Base route: /api/users

// Create and get all users
router.route('/')
  .post(createUser)
  .get(getUsers);

// Get, update, delete user by ID
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Get blogs by user
router.route('/:userId/blogs')
  .get(getBlogsByUser);

// Get bookmarks for user
router.route('/:userId/bookmarks')
  .get(getUserBookmarks);

// Get drafts by user
router.route('/:userId/drafts')
  .get(getDraftsByUser);

export default router;
