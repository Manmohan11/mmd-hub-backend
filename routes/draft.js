import express from 'express';
import {
  createDraft,
  getDraftById,
  updateDraft,
  deleteDraft
} from '../controllers/draft.js';

const router = express.Router();

// Base route: /api/drafts

// Create a new draft
router.route('/')
  .post(createDraft);

// Get, update, delete draft by ID
router.route('/:id')
  .get(getDraftById)
  .put(updateDraft)
  .delete(deleteDraft);

export default router;
