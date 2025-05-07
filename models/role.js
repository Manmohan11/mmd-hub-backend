import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
    },
    permissions: [{
      type: String,
      enum: ['create_blog', 'edit_blog', 'delete_blog', 'review_blog', 
             'create_comment', 'edit_comment', 'delete_comment',
             'manage_users', 'manage_roles', 'flag_content'],
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
