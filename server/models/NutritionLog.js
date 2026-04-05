const mongoose = require('mongoose');

const nutritionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  foodItems: [{
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  }],
  totalCalories: { type: Number, default: 0 },
  totalMacros: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Pre-save to optionally auto-sum totals if they are empty
// For now, assume totals are calculated before saving

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
