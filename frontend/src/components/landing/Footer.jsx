import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';
import { Rocket } from 'lucide-react';
import '../../styles/global.css';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border)',
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-xl)',
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Main Footer Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
        }}>
          {/* Brand */}
          <Link to={ROUTES.HOME} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
          }}>
            <span style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}>
              <Rocket size={14} />
            </span>
            CollabSphere
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xl)',
            flexWrap: 'wrap',
          }}>
            <Link to={ROUTES.HOME} style={footerLinkStyle}>Projects</Link>
            <Link to={ROUTES.HOME} style={footerLinkStyle}>Showcases</Link>
            <a href="#what-is-collabsphere" style={footerLinkStyle}>About</a>
            <Link to={ROUTES.LOGIN} style={footerLinkStyle}>Login</Link>
            <Link to={ROUTES.REGISTER} style={{ ...footerLinkStyle, color: 'var(--color-accent)', fontWeight: 'var(--font-weight-bold)' }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-lg)',
          textAlign: 'center',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-subtle)',
        }}>
          © {new Date().getFullYear()} CollabSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-muted)',
  transition: 'color var(--transition-fast)',
};
