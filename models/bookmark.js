import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Blog is required'],
    },
  },
  { timestamps: true }
);

// Ensure a user can only bookmark a blog once
bookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
