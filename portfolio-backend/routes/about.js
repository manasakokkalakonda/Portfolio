// routes/about.js
const express = require('express');
const router = express.Router();
const { About, AboutHistory } = require('../models/About');
// Assume auth middleware is imported as verifyToken
const verifyToken = require('../middleware/auth'); 

// GET current about content
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Update) about content & save a history snapshot
router.put('/', verifyToken, async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (about) {
      // Save current state to history before updating
      await AboutHistory.create({
        aboutId: about._id,
        title: about.title,
        bio: about.bio,
        image: about.image,
        modifiedAt: new Date()
      });

      about.title = req.body.title;
      about.bio = req.body.bio;
      about.image = req.body.image;
      about.updatedAt = Date.now();
      await about.save();
    } else {
      about = await About.create(req.body);
    }
    
    res.json({ message: 'About updated successfully', about });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET history logs for About
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await AboutHistory.find().sort({ modifiedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST revert to a specific history version
router.post('/history/revert/:id', verifyToken, async (req, res) => {
  try {
    const historicalVersion = await AboutHistory.findById(req.params.id);
    if (!historicalVersion) return res.status(404).json({ error: 'History record not found' });

    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    // Save current state to history first
    await AboutHistory.create({
      aboutId: about._id,
      title: about.title,
      bio: about.bio,
      image: about.image,
      modifiedAt: new Date()
    });

    // Revert data
    about.title = historicalVersion.title;
    about.bio = historicalVersion.bio;
    about.image = historicalVersion.image;
    about.updatedAt = Date.now();
    await about.save();

    res.json({ message: 'Successfully reverted to selected history version', about });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE about content
router.delete('/', verifyToken, async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ error: 'About content not found' });

    // Optional: save final state to history before deleting
    await AboutHistory.create({
      aboutId: about._id,
      title: about.title,
      bio: about.bio,
      image: about.image,
      modifiedAt: new Date()
    });

    await About.deleteOne({ _id: about._id });
    res.json({ message: 'About content deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;