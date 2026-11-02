import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';
import { Menu, X, Cpu, LayoutDashboard, LogOut, ArrowRight, Compass, Award } from 'lucide-react';
import '../../styles/global.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navLinkStyle = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-muted)',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

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
        height: '68px',
      }}>
        {/* Left: Futuristic Logo */}
        <Link to={ROUTES.HOME} style={{
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

        {/* Center: Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--space-xl)',
        }} className="desktop-nav">
          <Link to={ROUTES.PROJECTS} style={navLinkStyle}>
            <Compass size={15} color="var(--color-cyan)" />
            Discover Matrix
          </Link>
          <Link to={ROUTES.SHOWCASE} style={navLinkStyle}>
            <Award size={15} color="var(--color-cyan)" />
            Showcases
          </Link>
          <a href="#what-is-collabsphere" style={navLinkStyle}>
            Architecture
          </a>
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
                <LayoutDashboard size={14} color="var(--color-cyan)" />
                Workspace ({user?.name?.split(' ')[0] || 'User'})
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: '0.5rem 0.8rem', fontSize: 'var(--font-size-xs)' }}
                title="Disconnect"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ padding: '0.55rem 1.2rem', fontSize: 'var(--font-size-xs)' }}>
                Access Portal
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ padding: '0.55rem 1.3rem', fontSize: 'var(--font-size-xs)' }}>
                Initiate Node <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
          }}
          className="mobile-nav-toggle"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-lg) var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}>
          <Link to={ROUTES.PROJECTS} onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Discover Matrix
          </Link>
          <Link to={ROUTES.SHOWCASE} onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Showcases
          </Link>
          <a href="#what-is-collabsphere" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Architecture
          </a>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  <LayoutDashboard size={16} /> Enter Console
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ width: '100%' }}>
                  Access Portal
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  Initiate Node
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Media Query Helpers */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
