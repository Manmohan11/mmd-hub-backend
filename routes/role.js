import express from 'express';
import { 
  createRole, 
  getRoles, 
  getRoleById, 
  updateRole, 
  deleteRole 
} from '../controllers/role.js';

const router = express.Router();

// Base route: /api/roles

// Create and get all roles
router.route('/')
  .post(createRole)
  .get(getRoles);

// Get, update, delete role by ID
router.route('/:id')
  .get(getRoleById)
  .put(updateRole)
  .delete(deleteRole);

export default router;
