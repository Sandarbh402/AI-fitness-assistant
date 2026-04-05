import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Left panel — feature intro */}
      <div style={{
        flex: 1,
        display: 'none',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--primary-light) 50%, #FFFFFF 100%)',
        borderRight: '1px solid var(--border-color)',
      }} className="auth-left-panel">
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          top: '20%', left: '10%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300,
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          bottom: '20%', right: '10%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 60, textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--primary), var(--orange))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px var(--primary-glow)',
            marginBottom: 32,
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            <Zap size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1, color: 'var(--text-main)' }}>
            Your <span className="gradient-text">best body</span><br />starts here.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 380, fontWeight: 500 }}>
            FitAI uses Google Gemini to craft a plan that's built specifically for your body, your goals, and your lifestyle — not a one-size-fits-all template.
          </p>
          <div style={{
            marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 340,
          }}>
            {[
              'Personalised AI workout & nutrition plan',
              'Adaptive weekly plan updates based on progress',
              'Daily weight tracking with visual charts',
            ].map(point => (
              <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--primary)', flexShrink: 0, marginTop: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px var(--primary-glow)',
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'white' }}>✓</span>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 600 }}>{point}</span>
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
          {/* Brand */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 48, textDecoration: 'none', color: 'var(--text-main)' }}>
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
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: '1rem', fontWeight: 500 }}>
            Sign in to continue your fitness journey
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
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <label className="input-label">Password</label>
              {/* Form Validation: Required */}
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 14, bottom: 13,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 8, padding: '14px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
