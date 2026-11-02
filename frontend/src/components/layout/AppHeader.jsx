import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';
import { 
  Terminal, 
  Plus, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Compass, 
  Shield, 
  Award,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import '../../styles/global.css';

export const AppHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CS';

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Left: Brand Logo + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xl)' }}>
          <Link to={ROUTES.DASHBOARD} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: '#FFFFFF',
            letterSpacing: '-0.025em',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-cyber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
            }}>
              <Cpu size={18} />
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-sans)',
            }}>
              Collab<span style={{ color: 'var(--color-cyan)', WebkitTextFillColor: 'var(--color-cyan)' }}>Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }} className="desktop-app-nav">
            <Link
              to={ROUTES.DASHBOARD}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive(ROUTES.DASHBOARD) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive(ROUTES.DASHBOARD) ? '#FFFFFF' : 'var(--color-text-muted)',
                backgroundColor: isActive(ROUTES.DASHBOARD) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive(ROUTES.DASHBOARD) ? '1px solid var(--color-accent-border)' : '1px solid transparent',
                boxShadow: isActive(ROUTES.DASHBOARD) ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={15} color={isActive(ROUTES.DASHBOARD) ? 'var(--color-cyan)' : 'currentColor'} />
              Dashboard
            </Link>

            <Link
              to={ROUTES.PROJECTS}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive(ROUTES.PROJECTS) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive(ROUTES.PROJECTS) ? '#FFFFFF' : 'var(--color-text-muted)',
                backgroundColor: isActive(ROUTES.PROJECTS) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive(ROUTES.PROJECTS) ? '1px solid var(--color-accent-border)' : '1px solid transparent',
                boxShadow: isActive(ROUTES.PROJECTS) ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Compass size={15} color={isActive(ROUTES.PROJECTS) ? 'var(--color-cyan)' : 'currentColor'} />
              Discover
            </Link>

            <Link
              to={ROUTES.SHOWCASE}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive(ROUTES.SHOWCASE) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive(ROUTES.SHOWCASE) ? '#FFFFFF' : 'var(--color-text-muted)',
                backgroundColor: isActive(ROUTES.SHOWCASE) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive(ROUTES.SHOWCASE) ? '1px solid var(--color-accent-border)' : '1px solid transparent',
                boxShadow: isActive(ROUTES.SHOWCASE) ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Award size={15} color={isActive(ROUTES.SHOWCASE) ? 'var(--color-cyan)' : 'currentColor'} />
              Showcase
            </Link>

            {user?.role === 'admin' && (
              <Link
                to={ROUTES.ADMIN}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive(ROUTES.ADMIN) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  color: isActive(ROUTES.ADMIN) ? '#f43f5e' : 'var(--color-text-muted)',
                  backgroundColor: isActive(ROUTES.ADMIN) ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                  border: isActive(ROUTES.ADMIN) ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Shield size={15} color="#f43f5e" />
                Terminal Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Actions + Profile Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}>
          <Link
            to={ROUTES.CREATE_PROJECT}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: 'var(--font-size-xs)',
              letterSpacing: '0.02em',
            }}
          >
            <Plus size={15} />
            <span className="create-project-text">Deploy Project</span>
          </Link>

          {/* User Status Node */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(22, 29, 45, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-xs)',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              color: 'var(--color-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {initials}
            </div>

            <div style={{ display: 'none', flexDirection: 'column' }} className="desktop-user-info">
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}>
                {firstName}
              </span>
              <span style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: user?.role === 'admin' ? '#f43f5e' : 'var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-emerald)',
                  boxShadow: '0 0 6px var(--color-emerald)',
                }} />
                {user?.role === 'admin' ? 'SYS_ADMIN' : 'ONLINE'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Terminate Session"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: 'var(--radius-xs)',
                marginLeft: '4px',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f43f5e';
                e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-subtle)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
            }}
            className="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-md) var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          <Link
            to={ROUTES.DASHBOARD}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              color: isActive(ROUTES.DASHBOARD) ? 'var(--color-cyan)' : 'var(--color-text-main)',
              backgroundColor: isActive(ROUTES.DASHBOARD) ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 'bold',
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            to={ROUTES.PROJECTS}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              color: isActive(ROUTES.PROJECTS) ? 'var(--color-cyan)' : 'var(--color-text-main)',
              backgroundColor: isActive(ROUTES.PROJECTS) ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 'bold',
            }}
          >
            <Compass size={18} /> Discover
          </Link>

          <Link
            to={ROUTES.SHOWCASE}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              color: isActive(ROUTES.SHOWCASE) ? 'var(--color-cyan)' : 'var(--color-text-main)',
              backgroundColor: isActive(ROUTES.SHOWCASE) ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 'bold',
            }}
          >
            <Award size={18} /> Showcase
          </Link>

          {user?.role === 'admin' && (
            <Link
              to={ROUTES.ADMIN}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                color: '#f43f5e',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 'bold',
              }}
            >
              <Shield size={18} /> Terminal Admin
            </Link>
          )}
        </div>
      )}

      {/* Responsive Header CSS */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-app-nav {
            display: flex !important;
          }
          .desktop-user-info {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
