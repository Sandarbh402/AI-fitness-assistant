import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', phoneNumber: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      // Auto-login after register
      await login(form.email, form.password);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--accent-light) 50%, #FFFFFF 100%)',
        borderRight: '1px solid var(--border-color)',
      }} className="auth-left-panel">
        <div style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          top: '15%', right: '5%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          bottom: '15%', left: '5%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 60, textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--accent), var(--orange))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px var(--accent-glow)',
            marginBottom: 32,
          }}>
            <Zap size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1, color: 'var(--text-main)' }}>
            Join <span className="gradient-text">thousands</span><br />transforming today.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 360, fontWeight: 500 }}>
            Create your account in seconds. Your AI coach will ask a few quick questions, then generate your personalised plan instantly.
          </p>
          <div style={{
            marginTop: 48,
            background: 'white',
            border: '1.5px solid var(--border-color)',
            borderRadius: 16, padding: '24px 28px',
            maxWidth: 340, width: '100%',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20, fontWeight: 700 }}>
              What happens next
            </div>
            {['Create your account (30 sec)', 'Tell the AI about your goals', 'Get your personalised plan instantly'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--primary), var(--orange))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 800, color: 'white',
                  boxShadow: '0 2px 6px var(--primary-glow)',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`.auth-left-panel { display: flex !important; } @media (max-width: 768px) { .auth-left-panel { display: none !important; } }`}</style>

      {/* Right panel — form */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        background: 'var(--bg-card)',
      }}>
        <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none', color: 'var(--text-main)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--primary), var(--orange))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--black)' }}>FitAI</span>
          </Link>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text-main)' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '1rem', fontWeight: 500 }}>
            Free forever. No credit card required.
          </p>

          {error && (
            <div style={{
              background: 'var(--primary-light)', border: '1px solid var(--primary)',
              padding: '12px 16px', borderRadius: 8, marginBottom: 24,
              color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Full Name</label>
                <input id="reg-name" name="name" type="text" className="input-field" placeholder="Sandarbh Gupta"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Phone Number</label>
                {/* Form Validation: Required, 10-digit limit */}
                <input id="reg-phone" name="phoneNumber" type="tel" className="input-field" placeholder="10-digit mobile"
                  value={form.phoneNumber} onChange={handleChange} required maxLength={10} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Email Address</label>
                <input id="reg-email" name="email" type="email" className="input-field" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required autoComplete="email" />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1', position: 'relative' }}>
                <label className="input-label">Password</label>
                {/* Form Validation: Required, Min length 8 for security */}
                <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} className="input-field"
                  placeholder="Min 8 characters" value={form.password} onChange={handleChange}
                  required minLength={8} autoComplete="new-password" style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, bottom: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button id="reg-submit" type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4, padding: '14px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
