import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    reason: {
      type: String,
      required: [true, 'Flag reason is required'],
      enum: ['spam', 'harassment', 'inappropriate', 'violence', 'hate_speech', 'misinformation', 'other'],
    },
    details: {
      type: String,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Validate that either blog or comment is provided but not both
flagSchema.pre('validate', function (next) {
  if ((this.blog && this.comment) || (!this.blog && !this.comment)) {
    return next(
      new Error('A flag must refer to either a blog or a comment, but not both or neither')
    );
  }
  next();
});

const Flag = mongoose.model('Flag', flagSchema);

export default Flag;
