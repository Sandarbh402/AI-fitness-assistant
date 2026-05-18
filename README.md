# Fit-AI: AI-Powered Fitness Assistant

Welcome to my project, **Fit-AI**! I built this application to help users achieve their fitness goals by combining standard tracking tools with the power of Artificial Intelligence. 

As a developer passionate about health and tech, I wanted to create a platform that doesn't just log data but actively learns from it to give personalized recommendations.

## What is Fit-AI?

Fit-AI is a full-stack **MERN (MongoDB, Express, React, Node.js)** web application. The core idea is simple: you track your daily progress, and the app uses AI to adjust your fitness plans dynamically. 

Instead of static workout routines, Fit-AI integrates with the **Google Gemini API** to provide custom insights based on your recent activity and a 7-day rolling average of your weight.

## Key Features I Implemented

* **AI-Driven Recommendations:** I integrated the Google Gemini API to analyze user progress. The AI looks at historical weight logs and daily check-ins to intelligently adapt fitness plans.
* **Daily Weight Tracker:** I built a robust tracking system that carries over previous weights and calculates a 7-day rolling average to provide a more accurate picture of progress, smoothing out daily fluctuations.
* **Premium User Interface:** I designed a vibrant, premium light-themed UI with smooth micro-animations. It's built to feel responsive, modern, and engaging.
* **Profile Management:** A complete user authentication flow where users can register, log in, and easily edit their profile details (including name and phone number).
* **VIT Vellore Branding:** The project is styled with a custom VIT Vellore theme.

## Tech Stack

I chose the MERN stack for its flexibility and performance:

* **Frontend:** React.js, Vanilla CSS for highly customized and dynamic styling, React Router for navigation.
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose for schema modeling)
* **AI Integration:** Google Gemini API

## Getting Started

If you'd like to run my project locally, here is how you can set it up:

### Prerequisites
* Node.js and npm installed on your machine
* A MongoDB instance (local or MongoDB Atlas)
* A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sandarbh402/AI-fitness-assistant.git
   cd AI-fitness-assistant
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the App:**
   Open two terminal windows.
   
   In the first terminal (run the server):
   ```bash
   cd server
   npm run dev
   ```
   
   In the second terminal (run the frontend):
   ```bash
   cd client
   npm run dev
   ```

## Next Steps & Future Plans
I'm constantly looking to improve this application. Some features I'm planning to add next include more detailed workout logging, macro-nutrient tracking, and even deeper AI insights for recovery and sleep.

Feel free to explore the code, and I'd love to hear any feedback!
