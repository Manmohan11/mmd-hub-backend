import mongoose from 'mongoose';
import { BLOG_STATUS } from '../utils/enum.js';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    summary: {
      type: String,
      required: [true, 'Blog summary is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.PENDING,
      required: [true, 'Blog status is required'],
    },
    views: {
      type: Number,
      default: 0,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    reviewComments: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for comments
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
});

// Virtual for likes count
blogSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'blog',
  count: true,
});

// Create index for search functionality
blogSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;