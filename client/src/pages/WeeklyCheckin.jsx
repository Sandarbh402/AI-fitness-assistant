import { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { Smile, Zap, Save, History, Scale, Activity } from 'lucide-react';

const WeeklyCheckin = () => {
  const { user } = useContext(AuthContext);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${user.token}` };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/checkin', { headers });
      if (res.ok) setHistory(await res.json());
    } catch (err) { console.error(err); }
  }, [user.token]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Note: Weight is usually handled in Dashboard quick log, 
      // but we support mood/energy/notes in this full check-in page.
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, energy, notes }),
      });
      if (res.ok) {
        setMessage('Check-in saved! Keep it up. 🚀');
        setNotes('');
        fetchHistory();
      }
    } catch (err) { setMessage('Failed to save check-in.'); } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 800, animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Weekly <span className="gradient-text">Reflection</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Mindset and recovery are as important as training</p>
        </div>

        {message && (
          <div style={{
            background: 'var(--accent-light)', border: '1.5px solid var(--accent-bright)',
            padding: '16px 20px', borderRadius: 12, marginBottom: 28,
            color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px', marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
            {/* Mood selector */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Smile size={18} color="var(--primary)" /> How are you feeling overall?
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val} type="button" onClick={() => setMood(val)}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, border: '1.5px solid var(--border-color)',
                      background: mood === val ? 'var(--primary-light)' : 'var(--bg-card)',
                      borderColor: mood === val ? 'var(--primary)' : 'var(--border-color)',
                      color: mood === val ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)'
                    }}
                  >
                    {val === 1 ? '😞' : val === 2 ? '😕' : val === 3 ? '😐' : val === 4 ? '🙂' : '🤩'}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy selector */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Zap size={18} color="var(--accent-bright)" /> Training Energy Levels
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val} type="button" onClick={() => setEnergy(val)}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, border: '1.5px solid var(--border-color)',
                      background: energy === val ? 'var(--accent-light)' : 'var(--bg-card)',
                      borderColor: energy === val ? 'var(--accent-bright)' : 'var(--border-color)',
                      color: energy === val ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)'
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Notes (How was your week? Any wins/struggles?)</label>
            <textarea
              className="input-field" rows="3" placeholder="I felt really strong during squats, but struggled with enough sleep..."
              value={notes} onChange={e => setNotes(e.target.value)}
              style={{ resize: 'none', padding: '16px', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ gap: 12, padding: '14px 40px', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Check-in'}
              {!loading && <Save size={18} />}
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <History size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Check-in History</h2>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1.5px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weight</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mood</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Energy</th>
                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={h._id} style={{ borderBottom: i < history.length - 1 ? '1px solid var(--bg-main)' : 'none' }}>
                  <td style={{ padding: '20px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                    {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--accent)', fontWeight: 700 }}>
                      <Scale size={14} /> {h.weight || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem' }}>
                    {h.mood === 5 ? '🤩' : h.mood === 4 ? '🙂' : h.mood === 3 ? '😐' : h.mood === 2 ? '😕' : h.mood === 1 ? '😞' : '—'}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 99, fontSize: '0.85rem' }}>
                      <Activity size={12} /> {h.energy || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {h.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WeeklyCheckin;
