import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';
import { Rocket, Sparkles, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
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
      backgroundColor: 'rgba(250, 248, 245, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-extrabold)',
          color: 'var(--color-text-main)',
          letterSpacing: '-0.03em',
        }}>
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Rocket size={18} />
          </span>
          CollabSphere
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-2xl)',
        }} className="desktop-nav">
          <a href="#features" style={navLinkStyle}>Features</a>
          <a href="#workspace" style={navLinkStyle}>Workspace</a>
          <a href="#showcases" style={navLinkStyle}>Showcases</a>
          <a href="#how-it-works" style={navLinkStyle}>How it works</a>
        </nav>

        {/* Right Action Buttons */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }} className="desktop-actions">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="btn btn-secondary">
                <LayoutDashboard size={16} color="var(--color-accent)" />
                Workspace ({user?.name.split(' ')[0]})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ border: 'none' }}>
                <LogOut size={16} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ border: 'none' }}>
                Log in
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary">
                Get Started
                <Sparkles size={16} />
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
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Features</a>
          <a href="#workspace" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Workspace</a>
          <a href="#showcases" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Showcases</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>How it works</a>
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
                Log in
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
