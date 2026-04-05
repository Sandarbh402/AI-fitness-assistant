const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', protect, async (req, res) => {
  const { age, gender, weight, height, weightGoal, activityLevel, gymFrequency, splitPreference } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile.age = age;
      profile.gender = gender;
      profile.currentWeight = weight;
      profile.height = height;
      profile.weightGoal = weightGoal;
      profile.activityLevel = activityLevel;
      profile.gymFrequency = gymFrequency;
      profile.splitPreference = splitPreference;
      await profile.save();
      return res.json(profile);
    }

    // Create
    profile = new Profile({
      user: req.user._id,
      age,
      gender,
      initialWeight: weight,
      currentWeight: weight,
      height,
      weightGoal,
      activityLevel,
      gymFrequency,
      splitPreference
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(400).json({ message: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
