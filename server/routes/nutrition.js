const express = require('express');
const router = express.Router();
const NutritionLog = require('../models/NutritionLog');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/nutrition
// @desc    Log food items and aggregate macros using OpenFoodFacts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { foodItems } = req.body; 
  // foodItems: [{ barcode: "123456", name: "Apple", servingSizeGrams: 100 }] or just raw text to search via OpenFoodFacts

  // Server-side Validation: Must have food items to log
  if (!foodItems || foodItems.length === 0) {
    return res.status(400).json({ message: 'Please provide food items to log' });
  }

  try {
    let totalCalories = 0;
    let totalMacros = { protein: 0, carbs: 0, fat: 0 };
    const processedItems = [];

    // Simple integration: Assume user just typed food name or we look up an exact barcode.
    // For simplicity without a complex search UI, the user submits known macros OR we do a mock fetch here.
    // In a real OpenFoodFacts setup, we'd hit: `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

    for (let item of foodItems) {
      let cal = Number(item.calories) || 0;
      let p = Number(item.protein) || 0;
      let c = Number(item.carbs) || 0;
      let f = Number(item.fat) || 0;

      // If user provided barcode instead of raw macros, fetch it (simulated or actual)
      if (item.barcode) {
        try {
          const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${item.barcode}.json`);
          const data = await res.json();
          if (data.status === 1 && data.product.nutriments) {
             const nutrients = data.product.nutriments;
             // Calculate based on 100g standard return
             const ratio = (item.servingSizeGrams || 100) / 100;
             cal = (nutrients['energy-kcal_100g'] || 0) * ratio;
             p = (nutrients['proteins_100g'] || 0) * ratio;
             c = (nutrients['carbohydrates_100g'] || 0) * ratio;
             f = (nutrients['fat_100g'] || 0) * ratio;
             item.name = item.name || data.product.product_name;
          }
        } catch (fetchErr) {
          console.error("OpenFoodFacts Error:", fetchErr.message);
        }
      }

      totalCalories += cal;
      totalMacros.protein += p;
      totalMacros.carbs += c;
      totalMacros.fat += f;

      processedItems.push({
        name: item.name,
        calories: cal,
        protein: p,
        carbs: c,
        fat: f,
      });
    }

    const nutritionLog = new NutritionLog({
      user: req.user._id,
      foodItems: processedItems,
      totalCalories,
      totalMacros
    });

    await nutritionLog.save();
    res.status(201).json(nutritionLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/nutrition
// @desc    Get user's nutrition logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await NutritionLog.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
