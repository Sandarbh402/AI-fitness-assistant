# FitAI - 🏋️‍♂️ Your AI Personal Trainer & Nutritionist
### Technical Documentation & Multi-Module Breakdown
---

## 1. Project Overview
**FitAI** is a premium, AI-driven fitness ecosystem that transitions users from generic workouts to data-backed, personalised performance. Built specifically for students at **VIT Vellore**, the platform leverages the **Gemini 1.5 Pro** model to dynamically adapt fitness and nutrition plans based on weekly user performance (weight trends, workout adherence, and calorie logs).

### 🚀 Core User Flow:
1.  **Registration**: User creates an account with personal details.
2.  **Onboarding**: User provides fitness metrics (age, weight, height, goal, activity).
3.  **Initial AI Plan**: Gemini generates a custom 7-day workout and nutrition split.
4.  **Daily Logging**: User tracks weight, calories, and completed workouts.
5.  **Weekly AI Adaptation**: Every 7 days, the user can "Regenerate" their plan. The AI reviews the last 7 days of logs and adjusts targets (macros and volume) to ensure progress.

---

## 2. Technology Stack
| Layer | Tech Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | High-performance SPA with fast refreshes. |
| **State** | React Context API | Global authentication and user profile management. |
| **Styling** | Vanilla CSS | Custom Premium Light Design System (Red/Gold/Silver). |
| **Icons** | Lucide React | Modern, consistent iconography for UX clarity. |
| **Charts** | Recharts | Visualisation of daily weight trends and macro rings. |
| **Backend** | Node.js + Express | RESTful API architecture. |
| **Database** | MongoDB + Mongoose | Distributed document storage for flexible fitness logs. |
| **AI** | Gemini 1.5 Pro | Advanced LLM for generating and adapting fitness plans. |

---

## 3. Project Structure
```text
fit-ai-app/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Sidebar, Layouts)
│   │   ├── context/        # AuthContext (State Management)
│   │   ├── pages/          # Every Screen (Dashboard, AI, Logs)
│   │   └── index.css       # Global Design System & Animations
├── server/                 # Backend (Node.js + Express)
│   ├── config/             # DB Connection (MongoDB)
│   ├── models/             # Mongoose Schemas (User, Profile, Logs)
│   ├── routes/             # API Endpoints (Auth, AI, Nutrition, etc.)
│   ├── middleware/         # Security (JWT Authentication)
│   └── index.js            # Server Entry Point
└── .env                    # Environment variables (API Keys, URI)
```

---

## 4. Backend Module Breakdown (server/)

### A. Authentication Module (`routes/auth.js`)
Handles the entire user lifecycle and profile updates.
- **`POST /register`**: Creates a new user. Validates 10-digit phone number.
- **`POST /login`**: Verifies credentials and returns a JWT token.
- **`GET /me`**: Retrieves current user data (used on app load).
- **`PATCH /me`**: Updates account details (Name, Email, Password).

### B. AI Engine Module (`routes/ai.js`)
The core "Brain" of the application.
- **`GET /`**: Fetches the existing AI plan from the Profile model.
- **`POST /generate`**: 
    - **Logic**: Gathers user profile + 7 days of weight/nutrition logs.
    - **Trigger**: Compiles a 600-word prompt for Gemini 1.5 Pro.
    - **Adaptation**: If logs exist, the prompt *explicitly* asks Gemini to adjust calories/protein based on the user's specific progress.
    - **Gate**: Enforces a 7-day cooldown between plan generations.

### C. Logging Modules
1.  **Workouts (`routes/workout.js`)**: 
    - **`POST /`**: Logs a session. Supports "Rest Day" flag to bypass exercise requirements.
    - **`GET /`**: Fetches history for the user's PR tracking.
2.  **Nutrition (`routes/nutrition.js`)**:
    - **`POST /`**: Logs daily food items. Aggregates total calories/macros for the entry.
3.  **Check-ins (`routes/checkin.js`)**:
    - **`POST /`**: Logs daily weight in KG.
    - **`GET /`**: Retrieves last 30 entries for the dashboard chart.

---

## 5. Frontend Module Breakdown (client/)

### A. Authenticated Layout (`layouts/DashboardLayout.jsx`)
Wraps every inner page of the app.
- **Components**: Contains the persistent **Sidebar** and a scrollable `app-main` container.
- **Design**: Implements the light-theme background and transitions.

### B. State Management (`context/AuthContext.jsx`)
- **Functions**: `login()`, `logout()`, `setUser()`.
- **Persistence**: Stores JWT in `localStorage` and hydrates the user state on refresh.

### C. Page Breakdown
| Page | Location | Primary Purpose |
| :--- | :--- | :--- |
| **Dashboard** | `/src/pages/Dashboard.jsx` | Shows weight over time, today's macro ring, and daily check-in button. |
| **AI Plans** | `/src/pages/AIDashboard.jsx` | Display current 7-day split and triggers plan updates. |
| **Log Workout** | `/src/pages/LogWorkout.jsx` | Multi-row form for session tracking with "Rest Day" toggle. |
| **Meal Journal** | `/src/pages/LogNutrition.jsx` | Tracks items/barcode against AI targets. |
| **Profile** | `/src/pages/Profile.jsx` | Edits base metrics (height/goal) and account info. |
| **Onboarding** | `/src/pages/Onboarding.jsx` | Initial data collection form (only for new users). |

---

## 6. Design System & User Experience

### 🎨 Visual Palette (Premium Light Theme)
- **Primary**: `#C0392B` (Deep Red) — Action buttons, active states.
- **Accent**: `#B8860B` (Dark Gold) — AI features, rewards, premium badges.
- **Secondary**: `#D4500A` (Burnt Orange) — Progress variations.
- **Neutral**: `#F7F7F8` (Silver/Grey) — Backgrounds and partitions.

### ✨ Animations (Detailed Spec)
- **Fluid Layout**: Every page load uses `fadeIn 0.5s ease-out` to transition content smoothly.
- **Interactive State**: Progress bars use `cubic-bezier(0.4, 0, 0.2, 1)` to animate from 0% on load.
- **Scroll Reveal**: Sections on the **Landing Page** reveal dynamically using Intersection Observer at a `0.12` threshold.
- **Typewriter**: Interactive hero text for "Your AI Coach" branding.

---

## 7. Setup & Installation

### Prerequisite Environment Variables (`.env`)
```bash
MONGO_URI=mongodb://localhost:27017/ai-fitness-db
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
PORT=5000
```

### Running Locally
1.  **Server**: `cd server && npm install && npm start`
2.  **Client**: `cd client && npm install && npm run dev`
3.  **Access**: Navigate to `http://localhost:5173`

---
**© 2026 FitAI · Built for VIT Vellore by Sandarbh, Aarnav & Aditya.**
