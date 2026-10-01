import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { HeroMockup } from './HeroMockup';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const Hero = () => {
  return (
    <section className="bg-grid-pattern" style={{
      paddingTop: 'clamp(var(--space-3xl), 6vw, var(--space-4xl))',
      paddingBottom: 'clamp(var(--space-3xl), 6vw, var(--space-4xl))',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Hero Content */}
        <div style={{ maxWidth: '720px', margin: '0 auto var(--space-3xl)' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, var(--font-size-6xl))',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            marginBottom: 'var(--space-md)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
          }}>
            Build Together.<br />
            <span style={{ color: 'var(--color-accent)' }}>
              Create Something Great.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(var(--font-size-base), 2vw, var(--font-size-lg))',
            color: 'var(--color-text-muted)',
            maxWidth: '560px',
            margin: '0 auto var(--space-2xl)',
            lineHeight: 'var(--line-height-relaxed)',
          }}>
            CollabSphere helps students discover projects, find teammates, and build together.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{
              padding: '0.75rem 1.6rem',
              fontSize: 'var(--font-size-base)',
            }}>
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a href="#what-is-collabsphere" className="btn btn-secondary" style={{
              padding: '0.75rem 1.4rem',
              fontSize: 'var(--font-size-base)',
            }}>
              <Compass size={18} color="var(--color-accent)" />
              Explore Projects
            </a>
          </div>
        </div>

        {/* Clean Single Product Preview Card */}
        <HeroMockup />
      </div>
    </section>
  );
};
