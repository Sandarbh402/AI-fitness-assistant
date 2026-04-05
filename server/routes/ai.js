const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Profile = require('../models/Profile');
const WorkoutLog = require('../models/WorkoutLog');
const NutritionLog = require('../models/NutritionLog');
const WeeklyCheckin = require('../models/WeeklyCheckin');
const { protect } = require('../middleware/authMiddleware');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: extract JSON from Gemini response (strips markdown code fences if any)
const extractJSON = (text) => {
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  return JSON.parse(cleaned);
};

// @route   POST /api/ai/initial
// @desc    Generate initial baseline plan based on user profile — returns structured JSON
// @access  Private
router.post('/initial', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Profile not found' });

    const userName = req.user.name || req.user.email.split('@')[0];

    const prompt = `You are an expert fitness and nutrition coach. Generate a personalized fitness plan for your client.

Client Profile:
- Name: ${userName}
- Age: ${profile.age}, Gender: ${profile.gender}
- Current Weight: ${profile.currentWeight}kg, Height: ${profile.height}cm
- Goal: ${profile.weightGoal}
- Activity Level: ${profile.activityLevel}
- Gym Frequency: ${profile.gymFrequency} days/week
- Preferred Split: ${profile.splitPreference}

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences. Just raw JSON.

The JSON must follow this exact schema:
{
  "goalSummary": "A 2-3 sentence personalized summary addressing the client by name, diving straight into their plan",
  "dailyCalories": <number>,
  "macros": {
    "protein": <grams as number>,
    "carbs": <grams as number>,
    "fat": <grams as number>
  },
  "weeklySchedule": {
    "Monday": "<workout description or Rest Day>",
    "Tuesday": "<workout description or Rest Day>",
    "Wednesday": "<workout description or Rest Day>",
    "Thursday": "<workout description or Rest Day>",
    "Friday": "<workout description or Rest Day>",
    "Saturday": "<workout description or Rest Day>",
    "Sunday": "<workout description or Rest Day>"
  },
  "coachNote": "A single motivational paragraph of actionable coaching advice personalized to their goal"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const plan = extractJSON(response.text);

    // Save plan metadata to profile
    profile.lastPlanGeneratedAt = new Date();
    profile.targetCalories = plan.dailyCalories;
    profile.targetProtein = plan.macros.protein;
    profile.targetCarbs = plan.macros.carbs;
    profile.targetFat = plan.macros.fat;
    profile.lastPlan = plan;
    await profile.save();

    res.json({ plan });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'Failed to generate plan', error: err.message });
  }
});

// @route   POST /api/ai/weekly
// @desc    Generate an updated plan based on the week's logs — returns structured JSON
// @access  Private
router.post('/weekly', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Profile not found' });

    // Check 7-day gate
    if (profile.lastPlanGeneratedAt) {
      const daysSince = (Date.now() - new Date(profile.lastPlanGeneratedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        const daysRemaining = Math.ceil(7 - daysSince);
        return res.status(403).json({ message: `Plan update available in ${daysRemaining} day(s)`, daysRemaining });
      }
    }

    // Grab logs from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const workouts = await WorkoutLog.find({ user: req.user._id, date: { $gte: oneWeekAgo }, isRestDay: { $ne: true } });
    const nutrition = await NutritionLog.find({ user: req.user._id, date: { $gte: oneWeekAgo } });
    const checkins = await WeeklyCheckin.find({ user: req.user._id, date: { $gte: oneWeekAgo } }).sort({ date: 1 });
    const oldCheckin = await WeeklyCheckin.findOne({ user: req.user._id, date: { $lt: oneWeekAgo } }).sort({ date: -1 });

    // Calculate 7-day average weight with carry-over logic
    let sumWeight = 0;
    let carryWeight = oldCheckin ? oldCheckin.weight : profile.currentWeight;
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const startOfDay = new Date(new Date(targetDate).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(targetDate).setHours(23, 59, 59, 999));
      const checkinForDay = checkins.find(c => c.date >= startOfDay && c.date <= endOfDay);
      if (checkinForDay) carryWeight = checkinForDay.weight;
      sumWeight += carryWeight;
    }
    const avgWeight = (sumWeight / 7).toFixed(1);

    const totalWorkouts = workouts.length;
    let avgCal = 0, avgPro = 0;
    if (nutrition.length > 0) {
      avgCal = Math.round(nutrition.reduce((sum, log) => sum + log.totalCalories, 0) / nutrition.length);
      avgPro = Math.round(nutrition.reduce((sum, log) => sum + log.totalMacros.protein, 0) / nutrition.length);
    }

    const userName = req.user.name || req.user.email.split('@')[0];
    const weightChange = (parseFloat(avgWeight) - profile.currentWeight).toFixed(1);
    const changeDirection = weightChange > 0 ? 'gained' : weightChange < 0 ? 'lost' : 'maintained';

    const prompt = `You are an expert fitness and nutrition coach reviewing a client's weekly progress.

Client: ${userName}
Goal: ${profile.weightGoal}
Starting Weight: ${profile.currentWeight}kg | 7-Day Average Weight: ${avgWeight}kg (${changeDirection} ${Math.abs(weightChange)}kg)
Workouts Completed: ${totalWorkouts}/${profile.gymFrequency} (target per week)
Avg Daily Calories: ${avgCal} kcal | Avg Daily Protein: ${avgPro}g
Previous Calorie Target: ${profile.targetCalories || 'N/A'} kcal

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences. Just raw JSON.

The JSON must follow this exact schema:
{
  "goalSummary": "A 2-3 sentence progress assessment addressing the client by name with honest feedback on their week",
  "dailyCalories": <adjusted number>,
  "macros": {
    "protein": <grams as number>,
    "carbs": <grams as number>,
    "fat": <grams as number>
  },
  "weeklySchedule": {
    "Monday": "<workout description or Rest Day>",
    "Tuesday": "<workout description or Rest Day>",
    "Wednesday": "<workout description or Rest Day>",
    "Thursday": "<workout description or Rest Day>",
    "Friday": "<workout description or Rest Day>",
    "Saturday": "<workout description or Rest Day>",
    "Sunday": "<workout description or Rest Day>"
  },
  "coachNote": "A single paragraph of specific, actionable coaching advice for the next week based on their actual progress data"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const plan = extractJSON(response.text);

    // Update profile with new plan data
    profile.lastPlanGeneratedAt = new Date();
    profile.currentWeight = parseFloat(avgWeight);
    profile.targetCalories = plan.dailyCalories;
    profile.targetProtein = plan.macros.protein;
    profile.targetCarbs = plan.macros.carbs;
    profile.targetFat = plan.macros.fat;
    profile.lastPlan = plan;
    await profile.save();

    res.json({ plan });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'Failed to generate weekly plan', error: err.message });
  }
});

// @route   GET /api/ai/plan-status
// @desc    Returns whether the user can regenerate their plan + days remaining
// @access  Private
router.get('/plan-status', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.json({ lastGeneratedAt: null, canRegenerate: true, daysRemaining: 0, plan: null });

    let canRegenerate = true;
    let daysRemaining = 0;

    if (profile.lastPlanGeneratedAt) {
      const daysSince = (Date.now() - new Date(profile.lastPlanGeneratedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        canRegenerate = false;
        daysRemaining = Math.ceil(7 - daysSince);
      }
    }

    res.json({
      lastGeneratedAt: profile.lastPlanGeneratedAt,
      canRegenerate,
      daysRemaining,
      plan: profile.lastPlan || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
