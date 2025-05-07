import Wallpaper from '../models/wallpapers.js';

// @desc    Create a new wallpaper
// @route   POST /api/wallpapers
// @access  Public
export const createWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.create(req.body);
    res.status(201).json(wallpaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all wallpapers with pagination and search
// @route   GET /api/wallpapers
// @access  Public
export const getWallpapers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Search functionality
    const searchQuery = req.query.search;
    let query = {};
    
    if (searchQuery) {
      query = { $text: { $search: searchQuery } };
    }
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Get total count for pagination
    const total = await Wallpaper.countDocuments(query);
    
    // Get wallpapers with pagination
    const wallpapers = await Wallpaper.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      wallpapers,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wallpaper by ID
// @route   GET /api/wallpapers/:id
// @access  Public
export const getWallpaperById = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    res.status(200).json(wallpaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top wallpapers by likes
// @route   GET /api/wallpapers/top/likes
// @access  Public
export const getTopWallpapersByLikes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const wallpapers = await Wallpaper.find({})
      .sort({ likes: -1 })
      .limit(limit);
    
    res.status(200).json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top wallpapers by downloads
// @route   GET /api/wallpapers/top/downloads
// @access  Public
export const getTopWallpapersByDownloads = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const wallpapers = await Wallpaper.find({})
      .sort({ downloads: -1 })
      .limit(limit);
    
    res.status(200).json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a wallpaper
// @route   PUT /api/wallpapers/:id/like
// @access  Public
export const likeWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    wallpaper.likes += 1;
    await wallpaper.save();
    
    res.status(200).json({ likes: wallpaper.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download a wallpaper
// @route   PUT /api/wallpapers/:id/download
// @access  Public
export const downloadWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    wallpaper.downloads += 1;
    await wallpaper.save();
    
    res.status(200).json({ 
      url: wallpaper.imageUrl,
      downloads: wallpaper.downloads 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};