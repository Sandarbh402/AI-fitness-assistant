import { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Trash2, Save, Salad, Flame, Target, ChevronDown, ChevronUp, History } from 'lucide-react';

const LogNutrition = () => {
  const { user } = useContext(AuthContext);
  const [foodItems, setFoodItems] = useState([{ name: '', calories: '', protein: '', carbs: '', fat: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const headers = { Authorization: `Bearer ${user.token}` };

  const fetchData = useCallback(async () => {
    try {
      const [pRes, nRes] = await Promise.all([
        fetch('/api/profile', { headers }),
        fetch('/api/nutrition', { headers }),
      ]);
      if (pRes.ok) setProfile(await pRes.ok ? await pRes.json() : null);
      if (nRes.ok) setHistory(await nRes.json());
    } catch (err) { console.error(err); }
  }, [user.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => setFoodItems([...foodItems, { name: '', calories: '', protein: '', carbs: '', fat: '' }]);
  const handleRemove = (i) => setFoodItems(foodItems.filter((_, idx) => idx !== i));
  const handleChange = (i, field, value) => {
    const next = [...foodItems];
    next[i][field] = value;
    setFoodItems(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItems }),
      });
      if (res.ok) {
        setMessage('Nutrition logged successfully! 🥗');
        setFoodItems([{ name: '', calories: '', protein: '', carbs: '', fat: '' }]);
        fetchData(); // Refresh history
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to log nutrition');
      }
    } catch (err) { setMessage(err.message); } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      {/* 
        Nutrition Journal Reveal
        Spec: fadeIn 0.5s ease-out
      */}
      <div style={{ maxWidth: 900, animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* Header and Add button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Meal <span className="gradient-text">Journal</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Fuel your performance with precision</p>
          </div>
          <button onClick={handleAdd} className="btn-primary" style={{ gap: 10, padding: '12px 24px' }}>
            <Plus size={18} /> Add Food Item
          </button>
        </div>

        {/* AI Targets Banner */}
        {profile?.targetCalories && (
          <div className="glass-card" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 28, borderLeft: '6px solid var(--primary)', background: 'var(--primary-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={22} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Precision Target</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{profile.targetCalories} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>kcal</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Prot.', val: profile.targetProtein, color: 'var(--primary)' },
                { label: 'Carbs', val: profile.targetCarbs, color: 'var(--accent-bright)' },
                { label: 'Fat', val: profile.targetFat, color: 'var(--orange)' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.color }}>{m.val}g</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div style={{
            background: message.includes('success') ? 'var(--accent-light)' : 'var(--primary-light)',
            border: `1.5px solid ${message.includes('success') ? 'var(--accent-bright)' : 'var(--primary)'}`,
            padding: '16px 20px', borderRadius: 12, marginBottom: 28,
            color: message.includes('success') ? 'var(--accent)' : 'var(--primary)',
            fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 10
          }}>
            {message.includes('success') ? <Salad size={18} /> : <Trash2 size={18} />}
            {message}
          </div>
        )}

        {/* Current Log Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px', marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 1fr 1fr 1fr 1fr 40px', gap: 16, marginBottom: 16 }}>
            {['Item Name', 'Cals', 'Prot (g)', 'Carb (g)', 'Fat (g)', ''].map(h => (
              <span key={h} style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {foodItems.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) 1fr 1fr 1fr 1fr 40px', gap: 16, alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                {/* Form Validation: Food name and calories are required */}
                <input
                  type="text" className="input-field" placeholder="e.g. Chicken Breast"
                  value={item.name} onChange={e => handleChange(i, 'name', e.target.value)} required
                  style={{ fontWeight: 600 }}
                />
                <input
                  type="number" className="input-field" placeholder="165"
                  value={item.calories} onChange={e => handleChange(i, 'calories', e.target.value)} required
                />
                <input
                  type="number" className="input-field" placeholder="31"
                  value={item.protein} onChange={e => handleChange(i, 'protein', e.target.value)}
                />
                <input
                  type="number" className="input-field" placeholder="0"
                  value={item.carbs} onChange={e => handleChange(i, 'carbs', e.target.value)}
                />
                <input
                  type="number" className="input-field" placeholder="3"
                  value={item.fat} onChange={e => handleChange(i, 'fat', e.target.value)}
                />
                {foodItems.length > 1 ? (
                  <button type="button" onClick={() => handleRemove(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver-dark)', padding: 8 }}>
                    <Trash2 size={18} />
                  </button>
                ) : <div />}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ gap: 12, padding: '16px 48px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Meal Log'}
              {!loading && <Save size={20} />}
            </button>
          </div>
        </form>

        {/* Nutrition History */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <History size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recent Journal Logs</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No history yet. Start logging your meals.
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
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.foodItems?.length} items logged</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                     <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', fontWeight: 700 }}>
                        <span style={{ color: 'var(--primary)' }}>{log.totalCalories} Cal</span>
                        <span style={{ color: 'var(--primary-hover)' }}>{log.totalMacros?.protein}P</span>
                        <span style={{ color: 'var(--accent-bright)' }}>{log.totalMacros?.carbs}C</span>
                        <span style={{ color: 'var(--orange)' }}>{log.totalMacros?.fat}F</span>
                     </div>
                     {expandedId === log._id ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </button>

                {expandedId === log._id && (
                  <div style={{ padding: '0 24px 24px', animation: 'fadeIn 0.25s ease-out' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid var(--border-color)' }}>
                          <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Item</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cal</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>P</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>C</th>
                          <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>F</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.foodItems.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--bg-main)' }}>
                            <td style={{ padding: '12px 0', fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{item.calories}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{item.protein}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{item.carbs}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '0.9rem' }}>{item.fat}</td>
                          </tr>
                        ))}
                        <tr style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          <td style={{ padding: '16px 0', fontSize: '0.9rem' }}>TOTAL</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{log.totalCalories}</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{log.totalMacros?.protein}</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '0.9rem' }}>{log.totalMacros?.carbs}</td>
                          <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '0.9rem' }}>{log.totalMacros?.fat}</td>
                        </tr>
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

export default LogNutrition;
