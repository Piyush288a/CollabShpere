import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';
import { Menu, X, Rocket, LayoutDashboard, LogOut } from 'lucide-react';
import '../../styles/global.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(250, 248, 245, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Left: Logo */}
        <Link to={ROUTES.HOME} style={{
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

        {/* Center: Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-xl)',
        }} className="desktop-nav">
          <a href="#what-is-collabsphere" style={navLinkStyle}>About</a>
          <a href="#how-it-works" style={navLinkStyle}>How it works</a>
          <Link to={ROUTES.HOME} style={navLinkStyle}>Projects</Link>
          <Link to={ROUTES.HOME} style={navLinkStyle}>Showcases</Link>
        </nav>

        {/* Right: Actions */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }} className="desktop-actions">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-xs)' }}>
                <LayoutDashboard size={14} color="var(--color-accent)" />
                Workspace ({user?.name.split(' ')[0]})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 0.85rem', fontSize: 'var(--font-size-xs)', border: 'none' }}>
                <LogOut size={14} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-xs)', border: 'none' }}>
                Login
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: 'var(--font-size-xs)' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-label="Toggle Navigation"
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
          <a href="#what-is-collabsphere" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>About</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>How it works</a>
          <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Projects</Link>
          <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Showcases</Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: 'var(--space-xs) 0' }} />

          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Go to Workspace ({user?.name})
              </Link>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-secondary" style={{ width: '100%' }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Login
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Inline styles for responsive queries */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-muted)',
  transition: 'color var(--transition-fast)',
};

const mobileNavLinkStyle = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-main)',
};
