import { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Scale, Ruler, Target, Plus, X, TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--primary)',
        borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem',
        boxShadow: 'var(--shadow-md)', color: 'var(--text-main)'
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{payload[0].value} kg</div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [todayNutrition, setTodayNutrition] = useState(null);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  const headers = { Authorization: `Bearer ${user.token}` };

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, checkinRes, nutritionRes] = await Promise.all([
        fetch('/api/profile', { headers }),
        fetch('/api/checkin/recent', { headers }),
        fetch('/api/nutrition', { headers }),
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      if (checkinRes.ok) setCheckins(await checkinRes.json());
      if (nutritionRes.ok) {
        const logs = await nutritionRes.json();
        const today = new Date().toDateString();
        const todayLog = logs.find(l => new Date(l.date).toDateString() === today);
        setTodayNutrition(todayLog || null);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  }, [user.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    setCheckinLoading(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: parseFloat(newWeight) }),
      });
      if (res.ok) {
        setCheckinSuccess(true);
        setNewWeight('');
        await fetchData();
        setTimeout(() => {
          setShowCheckinModal(false);
          setCheckinSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckinLoading(false);
    }
  };

  // Chart data
  const chartData = checkins.map(c => ({
    date: new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    weight: c.weight,
  }));

  // Macro percentages for display - Replaced with Light Theme colors (Red/Gold/Orange)
  const macroData = profile ? [
    {
      name: 'Protein',
      target: profile.targetProtein || 0,
      current: todayNutrition?.totalMacros?.protein || 0,
      color: 'var(--primary)',
    },
    {
      name: 'Carbs',
      target: profile.targetCarbs || 0,
      current: todayNutrition?.totalMacros?.carbs || 0,
      color: 'var(--accent-bright)',
    },
    {
      name: 'Fat',
      target: profile.targetFat || 0,
      current: todayNutrition?.totalMacros?.fat || 0,
      color: 'var(--orange)',
    },
  ] : [];

  const todayCal = todayNutrition?.totalCalories || 0;
  const targetCal = profile?.targetCalories || 0;
  const calPct = targetCal ? Math.min(100, Math.round((todayCal / targetCal) * 100)) : 0;

  const firstName = user?.name?.split(' ')[0] || 'Champ';

  return (
    <DashboardLayout>
      {/* 
        Container Entrance Animation
        Spec: fadeIn 0.5s ease-out
        Purpose: Soft-reveal dashboard cards as they load.
      */}
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 4, fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Welcome back, <span className="gradient-text">{firstName}</span> 👋
            </h1>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCheckinModal(true)}
            style={{ gap: 8, padding: '12px 24px' }}
          >
            <Plus size={18} /> Log Today's Weight
          </button>
        </div>

        {/* Stats row */}
        {profile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div className="stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Scale size={16} color="var(--primary)" />
                <span className="stat-label">Current Weight</span>
              </div>
              <div className="stat-value">{profile.currentWeight}<span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>kg</span></div>
            </div>
            <div className="stat-card" style={{ borderTop: '4px solid var(--accent-bright)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Ruler size={16} color="var(--accent-bright)" />
                <span className="stat-label">Height</span>
              </div>
              <div className="stat-value">{profile.height}<span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>cm</span></div>
            </div>
            <div className="stat-card" style={{ borderTop: '4px solid var(--orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Target size={16} color="var(--orange)" />
                <span className="stat-label">Goal</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 8, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                {profile.weightGoal}
              </div>
            </div>
            {profile.targetCalories && (
              <div className="stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <TrendingUp size={16} color="var(--primary)" />
                  <span className="stat-label">Daily Target</span>
                </div>
                <div className="stat-value">{profile.targetCalories}<span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>kcal</span></div>
              </div>
            )}
          </div>
        )}

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: checkins.length > 0 ? '1fr 360px' : '1fr', gap: 24, marginBottom: 32 }}>
          {/* Weight chart */}
          {checkins.length > 0 && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>Weight Progress</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Tracking your journey in kilograms</p>
              </div>
              <div style={{ flex: 1, minHeight: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3}
                      dot={{ fill: 'var(--primary)', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Macros card */}
          {profile?.targetCalories && (
            <div className="glass-card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>Nutrition Tracker</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 28, fontWeight: 500 }}>Daily macros vs. AI targets</p>

              {/* Calories ring with Light Theme styles */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                  width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                  background: `conic-gradient(var(--primary) ${calPct * 3.6}deg, var(--silver-light) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: calPct > 0 ? '0 8px 24px var(--primary-glow)' : 'none',
                }}>
                  <div style={{
                    width: 92, height: 92, borderRadius: '50%',
                    background: 'var(--bg-card)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{calPct}%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CALORIES</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  {todayCal} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>/ {targetCal} kcal</span>
                </div>
              </div>

              {/* Macro bars */}
              <div className="macro-bar-wrap">
                {macroData.map(m => (
                  <div key={m.name} className="macro-bar-row">
                    <div className="macro-bar-header">
                      <span style={{ color: m.color, fontWeight: 700, fontSize: '0.85rem' }}>{m.name}</span>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600 }}>{m.current}g <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>/ {m.target}g</span></span>
                    </div>
                    <div className="macro-bar-track">
                      <div className="macro-bar-fill" style={{
                        width: `${m.target ? Math.min(100, (m.current / m.target) * 100) : 0}%`,
                        background: m.color,
                        boxShadow: `0 2px 6px ${m.color}33`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check-ins state */}
        {checkins.length === 0 && profile && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '64px 40px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <Scale size={36} color="var(--accent-bright)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Ready for your first check-in?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '1rem', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Log your current weight to start your visual progress chart and help the AI adjust your plan.
            </p>
            <button className="btn-accent" onClick={() => setShowCheckinModal(true)} style={{ padding: '16px 36px', fontSize: '1rem' }}>
              <Plus size={20} /> Log First Check-in
            </button>
          </div>
        )}
      </div>

      {/* Quick check-in modal */}
      {showCheckinModal && (
        <div className="modal-overlay" onClick={() => setShowCheckinModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={20} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Weight Check-in</h2>
              </div>
              <button onClick={() => setShowCheckinModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                <X size={24} />
              </button>
            </div>

            {checkinSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: '#DEF7EC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                </div>
                <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Success!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your physical progress has been logged.</p>
              </div>
            ) : (
              <form onSubmit={handleCheckin}>
                <div className="input-group">
                  <label className="input-label" style={{ textAlign: 'center', display: 'block', marginBottom: 12 }}>Weight in Kilograms</label>
                  {/* 
                    Form Validation: Weight Check-in
                    - Type: Number (with step 0.1)
                    - Range: 20kg to 400kg
                    - Required: Mandatory for tracking
                  */}
                  <input
                    type="number" step="0.1" min="20" max="400"
                    className="input-field"
                    placeholder={`${profile?.currentWeight || '—'}`}
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    autoFocus required
                    style={{ fontSize: '2.5rem', textAlign: 'center', padding: '20px', fontWeight: 800, borderRadius: 16 }}
                  />
                  <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                    Recommended: Log every morning for accuracy.
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: 8 }} disabled={checkinLoading}>
                  {checkinLoading ? 'Saving...' : 'Save Today\'s Weight'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
