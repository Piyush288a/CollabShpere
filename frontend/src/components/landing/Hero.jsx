import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { HeroMockup } from './HeroMockup';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const Hero = () => {
  return (
    <section className="bg-grid-pattern" style={{
      paddingTop: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-3xl)',
          alignItems: 'center',
        }} className="hero-grid">
          {/* Left Column: Hero Content */}
          <div style={{ maxWidth: '640px' }}>
            {/* Top Badge */}
            <div className="badge" style={{ marginBottom: 'var(--space-lg)' }}>
              <Sparkles size={14} />
              <span>Student Collaboration Platform</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              marginBottom: 'var(--space-lg)',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}>
              Build Together.{' '}
              <span style={{ color: 'var(--color-accent)' }}>
                Create Something Great.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p style={{
              fontSize: 'clamp(var(--font-size-base), 2vw, var(--font-size-lg))',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-2xl)',
              lineHeight: 'var(--line-height-relaxed)',
            }}>
              CollabSphere helps students discover software projects, find skilled teammates, manage task boards, chat in real time, and showcase finished work to the campus community.
            </p>

            {/* CTA Group */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}>
              <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{
                padding: '0.85rem 1.75rem',
                fontSize: 'var(--font-size-base)',
              }}>
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <a href="#showcases" className="btn btn-secondary" style={{
                padding: '0.85rem 1.5rem',
                fontSize: 'var(--font-size-base)',
              }}>
                <Compass size={18} color="var(--color-accent)" />
                Explore Projects
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Visual Mockup */}
          <div>
            <HeroMockup />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </section>
  );
};
