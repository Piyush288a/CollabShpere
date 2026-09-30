import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const FinalCTA = () => {
  return (
    <section style={{
      paddingTop: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div className="container">
        <div style={{
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-2xl), 6vw, var(--space-4xl))',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-glow)',
        }}>
          {/* Subtle Decorative Background Circles */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-lg)',
            }}>
              <Sparkles size={14} />
              JOIN CAMPUS COLLABORATORS
            </div>

            <h2 style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2rem, 4vw, var(--font-size-5xl))',
              fontWeight: 'var(--font-weight-extrabold)',
              marginBottom: 'var(--space-lg)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}>
              Your next project starts with the right team.
            </h2>

            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--space-2xl)',
              lineHeight: 'var(--line-height-relaxed)',
            }}>
              Join CollabSphere today to discover project ideas, recruit skilled teammates, manage tasks, and showcase software to your university community.
            </p>

            <Link to={ROUTES.REGISTER} className="btn" style={{
              backgroundColor: 'var(--color-dark)',
              color: '#FFFFFF',
              padding: '0.9rem 2.2rem',
              fontSize: 'var(--font-size-base)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              Start Building — It's Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
