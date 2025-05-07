import mongoose from 'mongoose';

const wallpaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Wallpaper title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Wallpaper description is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Wallpaper image URL is required'],
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
    resolution: {
      type: String,
      required: [true, 'Wallpaper resolution is required'],
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for search functionality
wallpaperSchema.index({ title: 'text', description: 'text', tags: 'text', category: 'text' });

const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema);

export default Wallpaper;