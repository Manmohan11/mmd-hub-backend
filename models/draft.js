import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    summary: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    lastSaved: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Draft = mongoose.model('Draft', draftSchema);

export default Draft;
