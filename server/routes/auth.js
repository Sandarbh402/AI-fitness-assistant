const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  // Server-side Validation: Name length
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Irrelevant/invalid name submitted' });
  }

  // Server-side Validation: 10-digit phone number regex
  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashedPassword, name, phoneNumber });
    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.json({
          _id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          token: generateToken(user._id),
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user info
// @access  Private
router.get('/me', async (req, res) => {
  // Manually verify token here since we don't import protect in this file
  const jwt_pkg = require('jsonwebtoken');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt_pkg.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ _id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// @route   PATCH /api/auth/me
// @desc    Update current user's name, email, phoneNumber, or password
// @access  Private
router.patch('/me', async (req, res) => {
  const jwt_pkg = require('jsonwebtoken');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt_pkg.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phoneNumber, currentPassword, newPassword } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) {
      // Server-side Validation: Phone number format
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
      user.phoneNumber = phoneNumber;
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required to set new password' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
