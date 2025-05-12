import mongoose from 'mongoose';
import {ACTIONS} from '../utils/enum.js';
import {ROLES} from '../utils/enum.js';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      enum: Object.keys(ROLES) 
    },
    permissions: [{
      type: String,
      enum: Object.values(ACTIONS)
    }],
    description: {
      type: String,
      required: [true, 'Role description is required'],
    },
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
