import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Home, User, Dumbbell, Salad, ClipboardCheck, Brain, LogOut, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/log-workout', icon: Dumbbell, label: 'Workout' },
  { to: '/log-nutrition', icon: Salad, label: 'Nutrition' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { to: '/ai', icon: Brain, label: 'AI Plans' },
];

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0,
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1.5px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
      boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
    }}>

      {/* Brand */}
      <div style={{
        padding: '24px 20px 18px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary), var(--orange))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px var(--primary-glow)',
        }}>
          <Zap size={20} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>FitAI</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Your AI Coach</div>
        </div>
      </div>

      {/* User badge */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'var(--primary-light)',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), var(--orange))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, color: 'white',
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2px',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'var(--transition)',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} color={isActive ? 'var(--primary)' : 'var(--silver)'}
                  style={{ transition: 'var(--transition)' }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={17} color="var(--primary)" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
