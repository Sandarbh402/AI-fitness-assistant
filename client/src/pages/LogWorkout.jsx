import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Trash2, Save, Dumbbell, History, Target } from 'lucide-react';

const LogWorkout = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = () => setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  const handleRemove = (i) => setExercises(exercises.filter((_, idx) => idx !== i));
  const handleChange = (i, field, value) => {
    const next = [...exercises];
    next[i][field] = value;
    setExercises(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isRestDay, exercises: isRestDay ? [] : exercises }),
      });
      if (res.ok) {
        setMessage('Workout logged successfully! 💪');
        if (!isRestDay) setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to log workout');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* 
        Workout Log Entry
        Spec: fadeIn 0.5s ease-out
      */}
      <div style={{ maxWidth: 800, animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Log <span className="gradient-text">Workout</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Track your strength and consistency</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-card)', padding: '10px 18px', borderRadius: 16,
            border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rest Day?</span>
            <button
              onClick={() => setIsRestDay(!isRestDay)}
              style={{
                width: 52, height: 28, borderRadius: 99, padding: 3, cursor: 'pointer',
                background: isRestDay ? 'var(--primary)' : 'var(--silver-light)',
                border: 'none', transition: 'var(--transition)', position: 'relative'
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: 'white',
                transform: isRestDay ? 'translateX(24px)' : 'translateX(0)',
                transition: 'var(--transition)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            background: message.includes('success') ? 'var(--accent-light)' : 'var(--primary-light)',
            border: `1.5px solid ${message.includes('success') ? 'var(--accent-bright)' : 'var(--primary)'}`,
            padding: '16px 20px', borderRadius: 12, marginBottom: 28,
            color: message.includes('success') ? 'var(--accent)' : 'var(--primary)',
            fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 10
          }}>
            {message.includes('success') ? <Save size={18} /> : <Trash2 size={18} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
          {!isRestDay ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: 16, marginBottom: 16 }}>
                {['Exercise Name', 'Sets', 'Reps', 'Weight (kg)', ''].map(h => (
                  <span key={h} style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {exercises.map((ex, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: 16, alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                    {/* Form Validation: Exercise name is required */}
                    <input
                      type="text" className="input-field" placeholder="e.g. Bench Press"
                      value={ex.name} onChange={e => handleChange(i, 'name', e.target.value)} required
                      style={{ fontWeight: 600 }}
                    />
                    {/* Form Validation: Sets and Reps are required */}
                    <input
                      type="number" className="input-field" placeholder="3"
                      value={ex.sets} onChange={e => handleChange(i, 'sets', e.target.value)} required
                    />
                    <input
                      type="number" className="input-field" placeholder="10"
                      value={ex.reps} onChange={e => handleChange(i, 'reps', e.target.value)} required
                    />
                    <input
                      type="number" className="input-field" placeholder="60"
                      value={ex.weight} onChange={e => handleChange(i, 'weight', e.target.value)}
                    />
                    {exercises.length > 1 ? (
                      <button type="button" onClick={() => handleRemove(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver-dark)', padding: 8 }}>
                        <Trash2 size={18} />
                      </button>
                    ) : <div />}
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleAdd} className="btn-outline"
                style={{ width: '100%', marginTop: 24, gap: 10, borderStyle: 'dashed', borderWidth: 2, padding: '14px' }}>
                <Plus size={18} /> Add Exercise Row
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <History size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Active Recovery Day</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 0, fontWeight: 500 }}>
                Rest is where the growth happens. We'll log today as a recovery session.
              </p>
            </div>
          )}

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px solid var(--border-color)' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', gap: 12 }} disabled={loading}>
              {loading ? 'Logging...' : isRestDay ? 'Log Recovery Day' : 'Complete Session'}
              {!loading && <Dumbbell size={20} />}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 32, display: 'flex', gap: 20 }}>
          <div className="glass-card" style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={22} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Weekly History</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>See your past lifts</div>
            </div>
          </div>
          <div className="glass-card" style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={22} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>PR Tracker</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Personal records summary</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogWorkout;
