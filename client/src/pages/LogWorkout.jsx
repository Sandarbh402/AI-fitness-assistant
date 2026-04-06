import { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Trash2, Save, Dumbbell, History, Target, ChevronDown, ChevronUp } from 'lucide-react';

const LogWorkout = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const headers = { Authorization: `Bearer ${user.token}` };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/workout', { headers });
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch (err) { console.error(err); }
  }, [user.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
        fetchData(); // Refresh history
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Log <span className="gradient-text">Workout</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Track your strength and consistency</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-card)', padding: '10px 18px', borderRadius: 16,
              border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rest Day?</span>
              <button
                type="button"
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
            {!isRestDay && (
              <button onClick={handleAdd} className="btn-primary" style={{ gap: 10, padding: '12px 24px' }}>
                <Plus size={18} /> Add Exercise
              </button>
            )}
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
            {message.includes('success') ? <Dumbbell size={18} /> : <Trash2 size={18} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px', marginBottom: 40 }}>
          {!isRestDay ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 1fr 1fr 1fr 40px', gap: 16, marginBottom: 16 }}>
                {['Exercise Name', 'Sets', 'Reps', 'Weight (kg)', ''].map(h => (
                  <span key={h} style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {exercises.map((ex, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 1fr 1fr 1fr 40px', gap: 16, alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                    <input
                      type="text" className="input-field" placeholder="e.g. Bench Press"
                      value={ex.name} onChange={e => handleChange(i, 'name', e.target.value)} required
                      style={{ fontWeight: 600 }}
                    />
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
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <Dumbbell size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Active Recovery Day</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 0, fontWeight: 500 }}>
                Rest is where the growth happens. We'll log today as a recovery session.
              </p>
            </div>
          )}

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
             <button type="submit" className="btn-primary" style={{ gap: 12, padding: '16px 48px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Logging...' : isRestDay ? 'Log Recovery Day' : 'Complete Session'}
              {!loading && <Save size={20} />}
            </button>
          </div>
        </form>

        {/* Workout History */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <History size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recent Sessions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No history yet. Get that first pump!
            </div>
          ) : (
            history.map((log) => (
              <div key={log._id} className="glass-card" style={{ padding: 0, overflow: 'hidden', border: expandedId === log._id ? '1.5px solid var(--primary)' : '1.5px solid var(--border-color)' }}>
                <button
                  onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', background: expandedId === log._id ? 'var(--primary-light)' : 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-main)', fontFamily: 'inherit', transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {new Date(log.date).toDateString() === new Date().toDateString() && (
                        <span className="tag" style={{ marginLeft: 10, background: 'var(--accent)', color: 'white', letterSpacing: '0.05em' }}>TODAY</span>
                      )}
                    </div>
                    {log.isRestDay ? (
                      <span className="tag" style={{ background: 'var(--silver-light)', color: 'var(--text-muted)' }}>REST DAY</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.exercises?.length} exercises performed</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                     {expandedId === log._id ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </button>

                {expandedId === log._id && !log.isRestDay && (
                  <div style={{ padding: '0 24px 24px', animation: 'fadeIn 0.25s ease-out' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid var(--border-color)' }}>
                          <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Exercise</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sets</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reps</th>
                          <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.exercises.map((ex, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--bg-main)' }}>
                            <td style={{ padding: '12px 0', fontSize: '0.9rem', fontWeight: 600 }}>{ex.name}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{ex.sets}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{ex.reps}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '0.9rem' }}>{ex.weight} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogWorkout;
