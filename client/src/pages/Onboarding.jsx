import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Target, ArrowRight, Zap } from 'lucide-react';

const Onboarding = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    weightGoal: 'maintain',
    activityLevel: 'moderate',
    gymFrequency: 3,
    splitPreference: 'push/pull/legs'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /* 
      Client-side Validation (Onboarding)
      - Age: 13-120 range
      - Weight: 20-400kg range
      - Height: 50-300cm range
    */
    if (Number(formData.age) < 13 || Number(formData.age) > 120) {
      return setError('Please enter a valid age (between 13 and 120)');
    }
    if (Number(formData.weight) < 20 || Number(formData.weight) > 400) {
      return setError('Please enter a valid weight');
    }
    if (Number(formData.height) < 50 || Number(formData.height) > 300) {
      return setError('Please enter a valid height in cm');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');
      
      navigate('/ai');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      {/* 
        Onboarding Modal entrance
        Spec: animate-fade-in (0.6s ease-out)
      */}
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--primary), var(--orange))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <Target size={32} color="white" />
          </div>
          <h1 className="heading-lg" style={{ marginBottom: 12 }}>Customise Your AI <span className="gradient-text">Physique AI</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>We need a few technical details to calibrate your perfect plan</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--primary-light)', border: '1.5px solid var(--primary)',
            padding: '16px', borderRadius: '12px', marginBottom: '24px',
            color: 'var(--primary)', textAlign: 'center', fontWeight: 700
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="input-group">
            <label className="input-label">Age</label>
            <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} required placeholder="24" style={{ fontWeight: 600 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Gender Identity</label>
            <select name="gender" className="input-field" value={formData.gender} onChange={handleChange} style={{ fontWeight: 600 }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Current Weight (kg)</label>
            <input type="number" name="weight" className="input-field" value={formData.weight} onChange={handleChange} required placeholder="75" style={{ fontWeight: 600 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Target Weight (kg)</label>
            <input type="number" name="targetWeight" className="input-field" value={formData.targetWeight} onChange={handleChange} required placeholder="70" style={{ fontWeight: 600 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Height (cm)</label>
            <input type="number" name="height" className="input-field" value={formData.height} onChange={handleChange} required placeholder="180" style={{ fontWeight: 600 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Fitness Objective</label>
            <select name="weightGoal" className="input-field" value={formData.weightGoal} onChange={handleChange} style={{ fontWeight: 600 }}>
              <option value="lose weight">Lose Weight</option>
              <option value="gain muscle">Gain Muscle</option>
              <option value="maintain">Maintain Physique</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Lifestyle Activity</label>
            <select name="activityLevel" className="input-field" value={formData.activityLevel} onChange={handleChange} style={{ fontWeight: 600 }}>
              <option value="sedentary">Sedentary (Desk Job)</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="very">Very Active (Athlete)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Gym Sessions / Week</label>
            <input type="number" name="gymFrequency" className="input-field" min="1" max="7" value={formData.gymFrequency} onChange={handleChange} required style={{ fontWeight: 600 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Preferred Routine Split</label>
            <select name="splitPreference" className="input-field" value={formData.splitPreference} onChange={handleChange} style={{ fontWeight: 600 }}>
              <option value="push/pull/legs">Push / Pull / Legs</option>
              <option value="upper/lower">Upper / Lower</option>
              <option value="bro split">Classic Bro Split</option>
              <option value="full body">Full Body Intensity</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', gap: 12, borderRadius: 12 }} disabled={loading}>
              {loading ? (
                <>Initialising Engine...</>
              ) : (
                <>Step Into Your Future <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
          <Zap size={12} fill="var(--accent)" color="var(--accent)" style={{ marginRight: 6 }} />
          Powered by Gemini 1.5 Pro · Built for VIT Vellore
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
