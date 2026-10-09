import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';
import { Rocket, Plus, LogOut, Menu, X, LayoutDashboard, Compass, Shield } from 'lucide-react';
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

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
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
      backgroundColor: 'var(--color-bg-surface)',
      borderBottom: '1px solid var(--color-border-subtle)',
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
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.025em',
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}>
              <Rocket size={16} />
            </span>
            CollabSphere
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-md)',
          }} className="desktop-app-nav">
            <Link
              to={ROUTES.DASHBOARD}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive(ROUTES.DASHBOARD) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive(ROUTES.DASHBOARD) ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: isActive(ROUTES.DASHBOARD) ? 'var(--color-accent-soft)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              to={ROUTES.PROJECTS}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive(ROUTES.PROJECTS) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive(ROUTES.PROJECTS) ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: isActive(ROUTES.PROJECTS) ? 'var(--color-accent-soft)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Compass size={16} />
              Discover Projects
            </Link>

            {user?.role === 'admin' && (
              <Link
                to={ROUTES.ADMIN}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive(ROUTES.ADMIN) ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  color: isActive(ROUTES.ADMIN) ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  backgroundColor: isActive(ROUTES.ADMIN) ? 'var(--color-accent-soft)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Shield size={16} />
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Actions & User Area */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }} className="desktop-app-actions">
          <Link
            to={ROUTES.CREATE_PROJECT}
            className="btn btn-primary"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: 'var(--font-size-xs)',
              gap: '4px',
            }}
          >
            <Plus size={15} />
            Create Project
          </Link>

          <div style={{
            height: '24px',
            width: '1px',
            backgroundColor: 'var(--color-border-subtle)',
          }} />

          {/* User Profile Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: user?.role === 'admin' ? 'var(--color-accent)' : 'var(--color-dark)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              {initials}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-main)',
              }}>
                {firstName}
              </span>
              {user?.role === 'admin' && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-bold)',
                  backgroundColor: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  ADMIN
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-app-toggle"
          aria-label="Toggle Menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            padding: 'var(--space-xs)',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-lg) var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            paddingBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-dark)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>
                {user?.name || 'Student'}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <Link
            to={ROUTES.DASHBOARD}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: isActive(ROUTES.DASHBOARD) ? 'var(--color-accent)' : 'var(--color-text-main)',
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to={ROUTES.PROJECTS}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: isActive(ROUTES.PROJECTS) ? 'var(--color-accent)' : 'var(--color-text-main)',
            }}
          >
            <Compass size={18} />
            Discover Projects
          </Link>

          {user?.role === 'admin' && (
            <Link
              to={ROUTES.ADMIN}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: isActive(ROUTES.ADMIN) ? 'var(--color-accent)' : 'var(--color-text-main)',
              }}
            >
              <Shield size={18} />
              Admin Panel
            </Link>
          )}

          <Link
            to={ROUTES.CREATE_PROJECT}
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-xs)' }}
          >
            <Plus size={16} />
            Create Project
          </Link>

          <button
            onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}

      {/* Inline styles for desktop/mobile breakpoints */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-app-nav { display: flex !important; }
          .desktop-app-actions { display: flex !important; }
          .mobile-app-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
