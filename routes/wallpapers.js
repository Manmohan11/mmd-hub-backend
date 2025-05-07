import express from 'express';
import { 
  createWallpaper, 
  getWallpapers, 
  getWallpaperById, 
  getTopWallpapersByLikes,
  getTopWallpapersByDownloads,
  likeWallpaper,
  downloadWallpaper
} from '../controllers/wallpapers.js';

const router = express.Router();

// Base route: /api/wallpapers

// Create a new wallpaper and get all wallpapers
router.route('/')
  .post(createWallpaper)
  .get(getWallpapers);

// Get top wallpapers by likes
router.route('/top/likes')
  .get(getTopWallpapersByLikes);

// Get top wallpapers by downloads
router.route('/top/downloads')
  .get(getTopWallpapersByDownloads);

// Get wallpaper by ID
router.route('/:id')
  .get(getWallpaperById);

// Like a wallpaper
router.route('/:id/like')
  .put(likeWallpaper);

// Download a wallpaper
router.route('/:id/download')
  .put(downloadWallpaper);

export default router;