# FitAI - 🏋️‍♂️ Your AI Personal Trainer & Nutritionist

## 🌟 Overview

**FitAI** is a high-performance, premium fitness ecosystem designed for the modern athlete. Built specifically for students at **VIT Vellore**, it transforms generic workout routines into data-driven, personalised performance paths. By integrating **Google Gemini AI**, the platform dynamically adapts your nutrition and training volume based on your actual weekly logs, weight trends, and activity levels.

## ✨ Core Features

- **Premium Light UI** – A high-contrast, professional interface with a signature palette: **Deep Red**, **Dark Gold**, and **Silver**.
- **AI-Powered Adaptation** 
  - *Baseline Generation*: Get an instant 7-day plan based on your profile.
  - *Weekly Evolution*: Every 7 days, the AI reviews your logs (calories, weight, intensity) and re-calibrates your macros and volume.
  - *Intelligent Gating*: Enforces a 7-day cooldown between plan regenerations to ensure physiological adaptation.
- **Precision Tracking**
  - **Dynamic Dashboard**: Interactive macro rings and progress charts via Recharts.
  - **Daily Nutrition Journal**: Comprehensive log for tracking meals against AI-generated targets.
  - **Workout Logger**: Exercise-by-exercise tracking with "Rest Day" support.
  - **Weight Check-in**: Automatic trend analysis and chronological data sorting.
- **Secure Authentication** – JWT-based identity management with profile persistence.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Lucide-React, Recharts, Vanilla CSS (Design Tokens).
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT.
- **Intelligence**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`.
- **Branding**: Crafted with ❤️ for **VIT Vellore**.

## 📁 Project Structure

```text
fit-ai-app/
├── client/                 # Premium React Frontend
│   ├── src/
│   │   ├── components/    # Sidebar, Global Layouts
│   │   ├── context/       # AuthState (JWT Persistence)
│   │   ├── pages/         # Dashboard, AI Engine, Logs, Profile
│   │   └── index.css      # Design System (Red/Gold/Silver Tokens)
├── server/                 # Express API Engine
│   ├── models/            # Mongoose Schemas (Logs, Users, Profiles)
│   ├── routes/            # API Endpoints (Auth, AI, Tracking)
│   ├── middleware/        # Security (JWT Guard)
│   └── index.js           # Entry Point
├── PROJECT_DOCUMENTATION.md # Comprehensive Technical Manual
└── README.md               # User & Setup Guide
```

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd fit-ai-app
   ```
2. **Configure Environment Variables**
   Create a `.env` file in the `/server` directory:
   ```dotenv
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
3. **Install Dependencies**
   ```bash
   # Server
   cd server && npm install

   # Client
   cd ../client && npm install
   ```
4. **Run the Engine**
   ```bash
   # Terminal 1 (Backend)
   cd server && node index.js

   # Terminal 2 (Frontend)
   cd client && npm run dev
   ```

## 🚥 API Overview

| Route | Method | Description |
|:--- | :--- | :--- |
| `/api/auth/register` | POST | User registration & 10-digit validation |
| `/api/auth/login` | POST | Authenticate and retrieve Bearer token |
| `/api/profile` | POST | Complete onboarding (Age, Weight, Goals) |
| `/api/workout` | POST | Log sets, reps, and exercise volume |
| `/api/nutrition` | POST | Track daily macros and caloric intake |
| `/api/checkin` | POST | Log daily bodyweight for trend analysis |
| `/api/ai/initial` | POST | Generate first 7-day AI plan |
| `/api/ai/weekly` | POST | Regenerate plan based on previous 7 days |

## 🧬 Design System

The application uses a custom design system located in `client/src/index.css`. 
- **Primary Color**: Deep Red (`#C0392B`) for calls to action.
- **Premium Accent**: Gold (`#B8860B`) for AI features and rewards.
- **Animations**: Page-level `fadeIn`, micro-interactive button lifting, and `IntersectionObserver` scroll reveals.

---
**© 2026 FitAI · Built by Sandarbh, Aarnav & Aditya · VIT Vellore**
