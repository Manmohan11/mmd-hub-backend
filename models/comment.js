import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
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
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual for likes count
commentSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment',
  count: true,
});

// Middleware to handle nesting for comments
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name username profilePicture',
  });
  
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
