import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const FinalCTA = () => {
  return (
    <section style={{
      paddingTop: 'clamp(var(--space-3xl), 6vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 6vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div className="container">
        <div style={{
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-2xl), 5vw, var(--space-4xl))',
          color: '#FFFFFF',
          textAlign: 'center',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2rem, 4vw, var(--font-size-5xl))',
              fontWeight: 'var(--font-weight-extrabold)',
              marginBottom: 'var(--space-md)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}>
              Have an idea?<br />
              Build it with the right people.
            </h2>

            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'var(--font-size-lg)',
              marginBottom: 'var(--space-2xl)',
              lineHeight: 'var(--line-height-relaxed)',
            }}>
              Start your next student project on CollabSphere today.
            </p>

            <Link to={ROUTES.REGISTER} className="btn" style={{
              backgroundColor: 'var(--color-dark)',
              color: '#FFFFFF',
              padding: '0.85rem 2rem',
              fontSize: 'var(--font-size-base)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
