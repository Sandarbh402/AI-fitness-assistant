import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Public
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Authenticated
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LogWorkout from './pages/LogWorkout';
import LogNutrition from './pages/LogNutrition';
import WeeklyCheckin from './pages/WeeklyCheckin';
import AIDashboard from './pages/AIDashboard';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/onboarding" />} />

      {/* Protected routes */}
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/log-workout" element={user ? <LogWorkout /> : <Navigate to="/login" />} />
      <Route path="/log-nutrition" element={user ? <LogNutrition /> : <Navigate to="/login" />} />
      <Route path="/checkin" element={user ? <WeeklyCheckin /> : <Navigate to="/login" />} />
      <Route path="/ai" element={user ? <AIDashboard /> : <Navigate to="/login" />} />

      {/* Legacy redirects */}
      <Route path="/weekly-checkin" element={<Navigate to="/checkin" />} />
      <Route path="/edit-profile" element={<Navigate to="/profile" />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
