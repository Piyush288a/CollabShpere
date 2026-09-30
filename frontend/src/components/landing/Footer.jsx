import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-dark)',
      color: 'var(--color-text-dark-main)',
      borderTop: '1px solid var(--color-dark-border)',
      paddingTop: 'var(--space-4xl)',
      paddingBottom: 'var(--space-2xl)',
    }}>
      <div className="container">
        {/* Footer Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3xl)',
          marginBottom: 'var(--space-4xl)',
        }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to={ROUTES.HOME} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: '#FFFFFF',
              marginBottom: 'var(--space-md)',
            }}>
              <span style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-md)',
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
            <p style={{
              color: 'var(--color-text-dark-muted)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 'var(--line-height-normal)',
            }}>
              The university student project collaboration and showcase platform. Built with React, Node.js, and Socket.IO.
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <li><a href="#features" style={footerLinkStyle}>Project Discovery</a></li>
              <li><a href="#workspace" style={footerLinkStyle}>Team Workspace</a></li>
              <li><a href="#workspace" style={footerLinkStyle}>Task Boards</a></li>
              <li><a href="#showcases" style={footerLinkStyle}>Campus Showcases</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <li><a href="#how-it-works" style={footerLinkStyle}>How It Works</a></li>
              <li><a href="#features" style={footerLinkStyle}>Collaboration Rules</a></li>
              <li><a href="#workspace" style={footerLinkStyle}>Real-time Socket Chat</a></li>
              <li><a href="#how-it-works" style={footerLinkStyle}>API Documentation</a></li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Account
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <li><Link to={ROUTES.LOGIN} style={footerLinkStyle}>Student Login</Link></li>
              <li><Link to={ROUTES.REGISTER} style={footerLinkStyle}>Create Account</Link></li>
              <li><Link to={ROUTES.REGISTER} style={footerLinkStyle}>Get Started</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--color-dark-border)',
          paddingTop: 'var(--space-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-dark-subtle)',
        }}>
          <div>
            © {new Date().getFullYear()} CollabSphere Platform. All rights reserved.
          </div>
          <div>
            Designed for Student Project Teams & Hackathons.
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  color: 'var(--color-text-dark-muted)',
  fontSize: 'var(--font-size-sm)',
  transition: 'color var(--transition-fast)',
};
