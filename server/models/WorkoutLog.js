const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  isRestDay: { type: Boolean, default: false },
  exercises: [
    {
      name: { type: String },
      sets: { type: Number },
      reps: { type: Number },
      weight: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
