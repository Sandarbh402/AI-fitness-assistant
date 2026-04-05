const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const workoutRoutes = require('./routes/workout');
const nutritionRoutes = require('./routes/nutrition');
const checkinRoutes = require('./routes/checkin');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} (IPv4)`));
