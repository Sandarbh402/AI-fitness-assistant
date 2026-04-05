const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  initialWeight: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  height: { type: Number, required: true },
  weightGoal: { type: String, required: true },
  activityLevel: { type: String, required: true },
  gymFrequency: { type: Number, required: true },
  splitPreference: { type: String, required: true },
  // AI plan metadata
  lastPlanGeneratedAt: { type: Date, default: null },
  targetCalories: { type: Number, default: null },
  targetProtein: { type: Number, default: null },
  targetCarbs: { type: Number, default: null },
  targetFat: { type: Number, default: null },
  lastPlan: { type: mongoose.Schema.Types.Mixed, default: null }, // stores the full parsed JSON plan
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
