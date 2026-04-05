import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, ArrowRight, Brain, BarChart2, Target, Menu, X, Star, Check } from 'lucide-react';

/* ── Typewriter hook ── */
/* 
  ── Typewriter Hook ── 
  Handles character-by-character text rendering at a set interval.
  Spec: 
  - speed: default 55ms per character.
  - Returns current displayed string and a 'done' completion flag.
*/
const useTypewriter = (text, speed = 55) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return { displayed, done };
};

/* ── Intersection observer for scroll animations ── */
/* 
  ── Intersection Observer (Reveal) Hook ── 
  Detects when an element enters the viewport to trigger entrance animations.
  Spec: 
  - threshold: 0.12 (triggers when 12% is visible).
  - disconnect after first reveal for improved performance.
*/
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Plans',
    desc: 'Google Gemini crafts your personalised workout and nutrition plan based on your body, goals, and lifestyle — not a template.',
    color: 'var(--primary)',
    bg: 'var(--primary-light)',
  },
  {
    icon: BarChart2,
    title: 'Daily Progress Tracking',
    desc: 'Log workouts, track calories, and check in with your weight every day. Watch your chart climb in the right direction.',
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
  },
  {
    icon: Target,
    title: 'Adaptive Weekly Updates',
    desc: 'After 7 days the AI reviews your actual data — weight trends, workout adherence, calorie logs — and adjusts your plan accordingly.',
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
  },
];

const testimonials = [
  { name: 'Rahul K.', role: 'Lost 8kg in 3 months', stars: 5, quote: "FitAI actually adapts to my lazy weeks. When I missed workouts it noticed and reduced my calories instead of pretending nothing happened. That's real coaching." },
  { name: 'Priya S.', role: 'Gained 4kg of muscle', stars: 5, quote: 'The AI plan felt like it was written just for me. The macros were spot-on and the weekly updates kept pushing me harder as I got stronger.' },
  { name: 'Arjun M.', role: 'Marathon runner', stars: 5, quote: "I was skeptical about AI fitness apps, but the nutrition tracking and weekly AI adaptation genuinely surprised me. It's like having a PT in your pocket." },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/mo',
    features: ['AI Initial Plan (1×)', 'Daily Weight Check-in', 'Basic Dashboard', '7-day History'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/mo',
    features: ['Unlimited AI Plan Updates', 'Full Workout Logging', 'Nutrition Macro Tracking', 'Progress Analytics'],
    cta: 'Start Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: '₹799',
    period: '/mo',
    features: ['Everything in Pro', 'Priority AI Model', 'Custom Split Builder', 'Advanced Body Analytics'],
    cta: 'Go Elite',
    popular: false,
  },
];

const team = [
  { name: 'Sandarbh Gupta', roll: '24BIT0506', initials: 'SG' },
  { name: 'Aarnav Mishra', roll: '24BIT0534', initials: 'AM' },
  { name: 'Aditya Menon', roll: '24BIT0514', initials: 'AD' },
];

/* ── Section wrapper with scroll reveal ── */
const RevealSection = ({ children, style = {} }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      ...style,
    }}>
      {children}
    </div>
  );
};

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { displayed, done } = useTypewriter(
    '"The only bad workout is the one that didn\'t happen."',
    45
  );

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-main)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--primary), var(--orange))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)',
            }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>FitAI</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="#features" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '8px 14px', borderRadius: 8, transition: 'var(--transition)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              Features
            </a>
            <a href="#pricing" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '8px 14px', borderRadius: 8, transition: 'var(--transition)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              Pricing
            </a>
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>Login</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>Sign Up <ArrowRight size={15} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(192, 57, 43, 0.08) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(184, 134, 11, 0.05) 0%, transparent 70%)',
          top: '20%', right: '10%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--primary-light)', border: '1px solid rgba(192, 57, 43, 0.2)',
            borderRadius: 99, padding: '6px 16px', marginBottom: 32,
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <Zap size={12} /> AI-Powered Fitness Platform
          </div>

          <h1 className="heading-xl" style={{
            minHeight: '5rem',
            fontStyle: 'italic',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            marginBottom: 0,
          }}>
            <span className="gradient-text">{displayed}</span>
            <span style={{
              borderRight: `3px solid var(--accent)`,
              animation: done ? 'blink 1s step-end infinite' : 'none',
              marginLeft: 2,
            }} />
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            margin: '32px auto',
            maxWidth: 560,
            lineHeight: 1.7,
          }}>
            Your AI personal trainer and nutritionist — in one app. Get a plan built for <em>your</em> body,
            track daily progress, and let the AI adapt your program as you grow.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-outline" style={{ padding: '16px 36px', fontSize: '1rem' }}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section">
        <div className="container">
          <RevealSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything you need to <span className="gradient-text">transform</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              No more guessing at the gym. FitAI gives you a science-backed, AI-personalised plan — then evolves it weekly based on your actual results.
            </p>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <RevealSection key={f.title} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="feature-card" style={{ height: '100%' }}>
                  <div className="icon-badge" style={{ background: f.bg, marginBottom: 20 }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: 'var(--bg-card-hover)' }}>
        <div className="container">
          <RevealSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Real results from <span className="gradient-text">real people</span></h2>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testimonial-card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={16} fill="var(--accent-bright)" color="var(--accent-bright)" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 24, fontSize: '0.95rem' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--orange))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, color: 'white',
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="section">
        <div className="container">
          <RevealSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Pricing</div>
            <h2 className="section-title">Simple, transparent <span className="gradient-text">pricing</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Start free. Upgrade when you're ready to unlock the full power of adaptive AI training.
            </p>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            {pricingPlans.map((p, i) => (
              <RevealSection key={p.name} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`pricing-card ${p.popular ? 'popular' : ''}`}>
                  {p.popular && <div className="pricing-badge">Most Popular</div>}
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>{p.name}</div>
                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{p.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <Check size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={p.popular ? 'btn-primary' : 'btn-outline'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {p.cta}
                  </Link>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="section" style={{ background: 'var(--bg-card-hover)' }}>
        <div className="container">
          <RevealSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Team</div>
            <h2 className="section-title">Built by <span className="gradient-text">students</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              FitAI was crafted with passion by three engineering students from VIT Vellore.
            </p>
          </RevealSection>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {team.map((member, i) => (
              <RevealSection key={member.name} style={{ transitionDelay: `${i * 0.15}s`, textAlign: 'center' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '40px 32px',
                  width: 220,
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(192, 57, 43, 0.45)';
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}>
                  <div className="team-avatar">{member.initials}</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6, color: 'var(--text-main)' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '0.04em', fontWeight: 600 }}>{member.roll}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '60px 0 40px',
        textAlign: 'center',
        background: 'white',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--primary), var(--orange))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--black)' }}>FitAI</span>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
            {[
              { label: 'GitHub', href: '#' },
              { label: 'Twitter', href: '#' },
              { label: 'Instagram', href: '#' },
            ].map(s => (
              <a key={s.label} href={s.href} style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'var(--transition)',
                textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                {s.label}
              </a>
            ))}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            © 2026 FitAI · Built by Sandarbh, Aarnav & Aditya · VIT Vellore
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
