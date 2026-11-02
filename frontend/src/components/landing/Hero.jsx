import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Terminal, Cpu, Sparkles, Activity } from 'lucide-react';
import { HeroMockup } from './HeroMockup';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const Hero = () => {
  return (
    <section className="bg-grid-pattern" style={{
      paddingTop: 'clamp(var(--space-4xl), 8vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-4xl), 8vw, var(--space-5xl))',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background Cyber Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Futuristic Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(22, 29, 45, 0.8)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cyan)',
            boxShadow: '0 0 10px var(--color-cyan)',
          }} />
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            color: 'var(--color-cyan)',
            letterSpacing: '0.05em',
          }}>
            SYSTEM ONLINE // CAMPUS MATRIX READY
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ maxWidth: '820px', margin: '0 auto var(--space-3xl)' }}>
          <h1 style={{
            fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            marginBottom: 'var(--space-lg)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: '#FFFFFF',
          }}>
            Construct Next-Gen Systems.<br />
            <span style={{
              background: 'var(--gradient-cyber)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
            }}>
              Unite Technical Minds.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(var(--font-size-base), 2vw, var(--font-size-xl))',
            color: 'var(--color-text-muted)',
            maxWidth: '640px',
            margin: '0 auto var(--space-2xl)',
            lineHeight: 'var(--line-height-relaxed)',
          }}>
            CollabSphere is the decentralized student workspace engine. Discover bleeding-edge student initiatives, recruit technical peers, and synchronize private task streams in real-time.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{
              padding: '0.85rem 1.8rem',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-mono)',
            }}>
              INITIALIZE WORKSPACE
              <ArrowRight size={18} />
            </Link>
            <Link to={ROUTES.PROJECTS} className="btn btn-secondary" style={{
              padding: '0.85rem 1.8rem',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-mono)',
            }}>
              <Compass size={18} color="var(--color-cyan)" />
              EXPLORE MATRIX
            </Link>
          </div>
        </div>

        {/* Clean High-Tech Holographic Preview Card */}
        <HeroMockup />
      </div>
    </section>
  );
};
