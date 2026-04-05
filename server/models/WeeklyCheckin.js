const mongoose = require('mongoose');

const weeklyCheckinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyCheckin', weeklyCheckinSchema);
