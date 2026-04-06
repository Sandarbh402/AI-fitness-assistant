import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Mail, Shield, Save, Camera, PencilLine, Ruler, Scale, Target } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '', email: '', height: '', weight: '', targetWeight: '', weightGoal: '', age: '', activityLevel: '', gymFrequency: '', splitPreference: ''
  });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authRes, profileRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch('/api/profile', { headers: { Authorization: `Bearer ${user.token}` } })
        ]);

        if (authRes.ok && profileRes.ok) {
          const uData = await authRes.json();
          const pData = await profileRes.json();
          setForm({
            name: uData.name || '',
            email: uData.email || '',
            height: pData.height || '',
            weight: pData.currentWeight || '',
            targetWeight: pData.targetWeight || '',
            weightGoal: pData.weightGoal || 'maintain',
            age: pData.age || '',
            activityLevel: pData.activityLevel || 'moderate',
            gymFrequency: pData.gymFrequency || 3,
            splitPreference: pData.splitPreference || 'push/pull/legs'
          });
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [user.token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // 1. Update User Basic Info
      const userRes = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });

      // 2. Update Profile Fitness Info
      const profRes = await fetch('/api/profile', {
        method: 'POST', // POST handles create/update in this app
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          age: form.age,
          height: form.height,
          weight: form.weight,
          targetWeight: form.targetWeight,
          weightGoal: form.weightGoal,
          activityLevel: form.activityLevel,
          gymFrequency: form.gymFrequency,
          splitPreference: form.splitPreference,
          gender: 'male' // Default or retrieved from profile
        }),
      });

      if (userRes.ok && profRes.ok) {
        const updatedUser = await userRes.json();
        setUser({ ...user, name: updatedUser.name, email: updatedUser.email });
        setMessage({ type: 'success', text: 'Profile and fitness objectives updated!' });
      } else {
        throw new Error('Failed to update some fields');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Account <span className="gradient-text">Settings</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Manage your identity and fitness preferences</p>
        </div>

        {message.text && (
          <div style={{
            background: message.type === 'success' ? 'var(--accent-light)' : 'var(--primary-light)',
            border: `1.5px solid ${message.type === 'success' ? 'var(--accent-bright)' : 'var(--primary)'}`,
            padding: '16px 20px', borderRadius: 12, marginBottom: 32,
            color: message.type === 'success' ? 'var(--accent)' : 'var(--primary)',
            fontWeight: 700, fontSize: '0.95rem'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32 }}>
          {/* Left Column — Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--orange))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                fontSize: '2.2rem', fontWeight: 800, color: 'white', boxShadow: '0 8px 32px var(--primary-glow)',
                position: 'relative'
              }}>
                {initials}
                <button style={{
                  position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%',
                  background: 'white', border: '1.5px solid var(--border-color)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                }}>
                  <Camera size={16} color="var(--text-muted)" />
                </button>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>{form.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 20 }}>{form.email}</p>
              <div className="tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-glow)' }}>PRO MEMBER</div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, color: 'var(--text-muted)' }}>Fitness Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ruler size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)' }}>HEIGHT</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{form.height} cm</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scale size={16} color="var(--orange)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)' }}>WEIGHT</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{form.weight} kg</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)' }}>GOAL</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize' }}>{form.weightGoal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Edit Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <form onSubmit={handleUpdateProfile} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <PencilLine size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Basic Information</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  {/* Form Validation: Name is required */}
                  <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  {/* Form Validation: Email format and required */}
                  <input type="email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Age</label>
                  <input type="number" className="input-field" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Height (cm)</label>
                  <input type="number" className="input-field" value={form.height} onChange={e => setForm({...form, height: e.target.value})} style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Current Weight (kg)</label>
                  <input type="number" className="input-field" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Target Weight (kg)</label>
                  <input type="number" className="input-field" value={form.targetWeight} onChange={e => setForm({...form, targetWeight: e.target.value})} style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Weight Goal</label>
                  <select className="input-field" value={form.weightGoal} onChange={e => setForm({...form, weightGoal: e.target.value})} style={{ fontWeight: 600 }}>
                    <option value="lose weight">Lose Weight</option>
                    <option value="maintain">Maintain</option>
                    <option value="gain muscle">Gain Muscle</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} style={{ fontWeight: 600 }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Activity Level</label>
                  <select className="input-field" value={form.activityLevel} onChange={e => setForm({...form, activityLevel: e.target.value})} style={{ fontWeight: 600 }}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Gym Sessions / Week</label>
                  <input type="number" className="input-field" value={form.gymFrequency} onChange={e => setForm({...form, gymFrequency: e.target.value})} min="1" max="7" style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Routine Split</label>
                  <select className="input-field" value={form.splitPreference} onChange={e => setForm({...form, splitPreference: e.target.value})} style={{ fontWeight: 600 }}>
                    <option value="push/pull/legs">Push / Pull / Legs</option>
                    <option value="upper/lower">Upper / Lower</option>
                    <option value="bro split">Bro Split</option>
                    <option value="full body">Full Body</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ padding: '12px 32px', gap: 8 }} disabled={loading}>
                  <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <Shield size={20} color="var(--accent-bright)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Account Security</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" style={{ fontWeight: 600 }} />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" style={{ fontWeight: 600 }} />
                </div>
              </div>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline" style={{ padding: '12px 32px', gap: 8 }}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
