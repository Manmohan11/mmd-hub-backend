import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

// Ensure a user can only like a blog or comment once
likeSchema.index({ user: 1, blog: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

// Validate that either blog or comment is provided but not both
likeSchema.pre('validate', function (next) {
  if ((this.blog && this.comment) || (!this.blog && !this.comment)) {
    return next(
      new Error('A like must refer to either a blog or a comment, but not both or neither')
    );
  }
  next();
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
