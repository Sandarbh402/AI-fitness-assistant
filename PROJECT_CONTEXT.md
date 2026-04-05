# AI Fitness App - Project Context Report

This file is intended for future AI assistants to quickly understand the current state, architecture, and features of this application.

## 🏗️ Architecture
- **Tech Stack**: MERN (MongoDB, Express, React, Node.js).
- **Frontend**: React (Vite) + Lucide React + HSL-based Vanilla CSS.
- **Backend**: Node.js + Express + JWT + Google Gemini AI.
- **Database**: MongoDB (Mongoose).

## 📁 Key Directories
- `/client`: Frontend source.
- `/server`: Backend source.
- `/server/models`: Database schemas.
- `/server/routes`: API endpoints.

## 🚀 Core Features
1. **User Authentication**: JWT-based registration and login.
2. **Profile Onboarding**: Collects fitness metrics (weight, goals, activity).
3. **Adaptive Tracking**: Daily weight logs with carry-over logic for 7-day averages.
4. **AI Coach**: 
   - `Initial Plan`: Based on profile.
   - `Weekly adaptive Plan`: Based on 7-day rolling weight average, workout frequency, and nutrition averages.

## 🛠️ Technical Details
- **AI Model**: `gemini-2.5-flash` via `@google/genai`.
- **Styling**: `index.css` contains a full design system with variable-based tokens.
- **State Management**: React Context (`AuthContext.jsx`) for user authentication status.

---
*Report generated on April 4, 2026.*
