const express = require('express');
const router = express.Router();
const WeeklyCheckin = require('../models/WeeklyCheckin');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/checkin
// @desc    Log a daily weight check-in
// @access  Private
router.post('/', protect, async (req, res) => {
  const { weight } = req.body;
  // Server-side Validation: Weight input is mandatory
  if (!weight) return res.status(400).json({ message: 'Weight is required' });

  try {
    const checkin = new WeeklyCheckin({ user: req.user._id, weight });
    await checkin.save();
    res.status(201).json(checkin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/checkin
// @desc    Get last 30 daily weight check-ins (ascending date for chart)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const checkins = await WeeklyCheckin.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30)
      .lean();
    // Return in ascending order for chart rendering
    res.json(checkins.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/checkin/recent
// @desc    Get last 7 daily weight check-ins (ascending date for chart)
// @access  Private
router.get('/recent', protect, async (req, res) => {
  try {
    const checkins = await WeeklyCheckin.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7)
      .lean();
    res.json(checkins.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
