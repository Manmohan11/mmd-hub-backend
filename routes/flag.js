import express from 'express';
import {
  createFlag,
  getFlags,
  getFlagById,
  resolveFlag
} from '../controllers/flag.js';

const router = express.Router();

// Base route: /api/flags

// Create flag and get all flags
router.route('/')
  .post(createFlag)
  .get(getFlags);

// Get flag by ID and resolve flag
router.route('/:id')
  .get(getFlagById)
  .delete(resolveFlag);

export default router;
