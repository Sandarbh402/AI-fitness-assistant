const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/workout
// @desc    Log a new workout or rest day
// @access  Private
router.post('/', protect, async (req, res) => {
  const { exercises, isRestDay } = req.body;

  // Server-side Validation: Must have exercises if not a rest day
  if (!isRestDay && (!exercises || exercises.length === 0)) {
    return res.status(400).json({ message: 'Please provide exercises to log or mark as a rest day' });
  }

  try {
    const workoutLog = new WorkoutLog({
      user: req.user._id,
      isRestDay: !!isRestDay,
      exercises: isRestDay ? [] : exercises,
    });

    await workoutLog.save();
    res.status(201).json(workoutLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/workout
// @desc    Get user's workout logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
