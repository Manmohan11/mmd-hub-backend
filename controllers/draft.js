import Draft from '../models/draft.js';

// @desc    Create a new draft
// @route   POST /api/drafts
// @access  Private
export const createDraft = async (req, res) => {
  try {
    // Add author from authenticated user
    const draft = await Draft.create({
      ...req.body,
      author: req.user._id,
    });
    
    await draft.populate('author', 'name username profilePicture');
    
    res.status(201).json(draft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get draft by ID
// @route   GET /api/drafts/:id
// @access  Private
export const getDraftById = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id)
      .populate('author', 'name username profilePicture');
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    // Ensure user is the author of the draft
    if (draft.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this draft' });
    }
    
    res.status(200).json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update draft
// @route   PUT /api/drafts/:id
// @access  Private
export const updateDraft = async (req, res) => {
  try {
    let draft = await Draft.findById(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    // Ensure user is the author of the draft
    if (draft.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this draft' });
    }
    
    // Update lastSaved timestamp
    req.body.lastSaved = Date.now();
    
    draft = await Draft.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author', 'name username profilePicture');
    
    res.status(200).json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete draft
// @route   DELETE /api/drafts/:id
// @access  Private
export const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    // Ensure user is the author of the draft
    if (draft.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this draft' });
    }
    
    await draft.deleteOne();
    
    res.status(200).json({ message: 'Draft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get drafts by user
// @route   GET /api/users/:userId/drafts
// @access  Private
export const getDraftsByUser = async (req, res) => {
  try {
    // Ensure the user is accessing their own drafts
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access these drafts' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Draft.countDocuments({ author: req.params.userId });
    
    const drafts = await Draft.find({ author: req.params.userId })
      .sort({ lastSaved: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      drafts,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
