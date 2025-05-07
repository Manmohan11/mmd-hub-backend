import Role from '../models/role.js';

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin
export const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private/Admin
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
