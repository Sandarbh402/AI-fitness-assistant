import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { Brain, Sparkles, Zap, ChevronDown, ChevronUp, Lock, RefreshCw } from 'lucide-react';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MacroBar = ({ label, value, max, color }) => {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="macro-bar-row">
      <div className="macro-bar-header">
        <span style={{ color, fontWeight: 700 }}>{label}</span>
        <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>{value}g</span>
      </div>
      <div className="macro-bar-track">
        <div className="macro-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const AIDashboard = () => {
  const { user } = useContext(AuthContext);
  const [planStatus, setPlanStatus] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDay, setOpenDay] = useState(null);

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/ai/plan-status', { headers });
        if (res.ok) {
          const data = await res.json();
          setPlanStatus(data);
          if (data.plan) setPlan(data.plan);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, [user.token]);

  const generatePlan = async (type) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/ai/${type}`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate plan');
      setPlan(data.plan);
      // Refresh status
      const statusRes = await fetch('/api/ai/plan-status', { headers });
      if (statusRes.ok) setPlanStatus(await statusRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasExistingPlan = !!plan;
  const canRegenerate = planStatus?.canRegenerate !== false;
  const daysRemaining = planStatus?.daysRemaining || 0;

  return (
    <DashboardLayout>
      {/* 
        AI-Insight Entrance
        Spec: fadeIn 0.5s ease-out
        Purpose: Smooth reveal for plan cards and weekly schedule.
      */}
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
              <span className="gradient-text">AI</span> Coaching <Sparkles size={24} style={{ color: 'var(--accent-bright)', marginLeft: 8 }} />
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Your personalised fitness roadmap powered by Gemini</p>
          </div>

          {/* Update plan button */}
          {hasExistingPlan && (
            <div style={{ position: 'relative' }}>
              <button
                className={canRegenerate ? 'btn-primary' : 'btn-outline'}
                onClick={() => canRegenerate && generatePlan('weekly')}
                disabled={loading || !canRegenerate}
                title={!canRegenerate ? `Available in ${daysRemaining} day(s)` : 'Generate updated plan'}
                style={{ gap: 8, padding: '12px 24px' }}
              >
                {!canRegenerate && <Lock size={16} />}
                {canRegenerate && !loading && <RefreshCw size={16} />}
                {loading ? 'Optimising...' : canRegenerate ? 'Refine Plan' : `Next Update in ${daysRemaining}d`}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--primary-light)', border: '1px solid var(--primary)',
            padding: '16px 20px', borderRadius: 12, marginBottom: 24,
            color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {/* No plan yet */}
        {!hasExistingPlan && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{
              width: 100, height: 100, margin: '0 auto 32px',
              borderRadius: 24,
              background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
              border: '1.5px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
            }}>
              <Brain size={44} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>
              Crafting your <span className="gradient-text">Personalised plan</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500 }}>
              Let Google Gemini analyse your profile, goals, and weight trends to build a detailed weekly schedule and precision nutrition targets.
            </p>
            <button className="btn-primary" onClick={() => generatePlan('initial')} disabled={loading}
              style={{ padding: '18px 48px', fontSize: '1.1rem', gap: 12, borderRadius: 16 }}>
              {loading ? (
                <><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite' }} /> Building your Plan...</>
              ) : (
                <><Zap size={22} fill="white" /> Generate My AI Plan</>
              )}
            </button>
          </div>
        )}

        {/* Plan display list */}
        {plan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Goal summary card */}
            <div className="glass-card" style={{ borderLeft: '6px solid var(--primary)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Plan Strategy
                </h3>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 500 }}>{plan.goalSummary}</p>
            </div>

            {/* Micro-stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 1.5fr', gap: 24 }}>
              {/* Target Calories */}
              <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 20 }}>
                  Daily Nutrient Energy
                </p>
                <div style={{
                  fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, var(--black), var(--primary))',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}>
                  {plan.dailyCalories?.toLocaleString()}
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: 12, fontWeight: 600 }}>kcal / day</div>
              </div>

              {/* Target Macros */}
              <div className="glass-card">
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 24 }}>
                  Macro precision split
                </p>
                <div className="macro-bar-wrap" style={{ gap: 20 }}>
                  <MacroBar label="Protein" value={plan.macros?.protein || 0} max={(plan.macros?.protein || 0) + (plan.macros?.carbs || 0) + (plan.macros?.fat || 0)} color="var(--primary)" />
                  <MacroBar label="Carbohydrates" value={plan.macros?.carbs || 0} max={(plan.macros?.protein || 0) + (plan.macros?.carbs || 0) + (plan.macros?.fat || 0)} color="var(--accent-bright)" />
                  <MacroBar label="Fats" value={plan.macros?.fat || 0} max={(plan.macros?.protein || 0) + (plan.macros?.carbs || 0) + (plan.macros?.fat || 0)} color="var(--orange)" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                  {[
                    { label: 'Prot.', val: plan.macros?.protein, color: 'var(--primary)' },
                    { label: 'Carbs', val: plan.macros?.carbs, color: 'var(--accent-bright)' },
                    { label: 'Fat', val: plan.macros?.fat, color: 'var(--orange)' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: m.color }}>{m.val}g</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly schedule accordion */}
            {plan.weeklySchedule && (
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA' }}>
                  <Zap size={20} color="var(--primary)" fill="var(--primary)" />
                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Target Training Schedule</h3>
                </div>
                {DAYS_ORDER.map((day, i) => {
                  const workout = plan.weeklySchedule[day] || '—';
                  const isRest = workout.toLowerCase().includes('rest');
                  const isOpen = openDay === day;
                  return (
                    <div key={day} style={{ borderBottom: i < 6 ? '1.5px solid var(--silver-light)' : 'none' }}>
                      <button
                        onClick={() => setOpenDay(isOpen ? null : day)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '20px 24px', background: isOpen ? 'var(--bg-card-hover)' : 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.95rem',
                          transition: 'var(--transition)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                          <span style={{
                            width: 60, fontSize: '0.8rem', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: isRest ? 'var(--text-subtle)' : 'var(--primary)',
                          }}>{day.slice(0, 3)}</span>
                          <span style={{ color: isRest ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: isRest ? 600 : 700 }}>
                            {workout.split('–')[0].split('-')[0].trim()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          {isRest ? (
                            <span className="tag" style={{ background: 'var(--silver-light)', color: 'var(--silver-dark)', border: '1px solid var(--border-color)' }}>OFF DAY</span>
                          ) : (
                            <span className="tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-glow)' }}>WORKOUT</span>
                          )}
                          {isOpen ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: '8px 32px 24px 108px',
                          color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8,
                          background: 'var(--bg-card-hover)',
                          animation: 'fadeIn 0.25s ease-out',
                          fontWeight: 500,
                        }}>
                          {workout}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Coach note card */}
            {plan.coachNote && (
              <div className="glass-card" style={{ borderLeft: '6px solid var(--accent-bright)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <Brain size={18} color="var(--accent-bright)" />
                  <h3 style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    AI Insight Note
                  </h3>
                </div>
                <p style={{ fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>
                  "{plan.coachNote}"
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIDashboard;
