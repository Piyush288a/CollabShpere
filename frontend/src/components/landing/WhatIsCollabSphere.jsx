import React from 'react';
import { Compass, Users, Code2 } from 'lucide-react';
import '../../styles/global.css';

export const WhatIsCollabSphere = () => {
  const concepts = [
    {
      icon: Compass,
      label: 'DISCOVER',
      description: 'Find projects worth building.',
    },
    {
      icon: Users,
      label: 'CONNECT',
      description: 'Find people who want to build them with you.',
    },
    {
      icon: Code2,
      label: 'BUILD',
      description: 'Work together and turn ideas into projects.',
    },
  ];

  return (
    <section id="what-is-collabsphere" style={{
      paddingTop: 'clamp(var(--space-3xl), 6vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 6vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border-subtle)',
      borderBottom: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, var(--font-size-4xl))',
          fontWeight: 'var(--font-weight-extrabold)',
          color: 'var(--color-text-main)',
          marginBottom: 'var(--space-lg)',
          letterSpacing: '-0.025em',
        }}>
          What is CollabSphere?
        </h2>

        {/* Short Paragraph */}
        <p style={{
          fontSize: 'clamp(var(--font-size-base), 2vw, var(--font-size-lg))',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: 'clamp(var(--space-2xl), 5vw, var(--space-4xl))',
          maxWidth: '720px',
          margin: '0 auto clamp(var(--space-2xl), 5vw, var(--space-4xl))',
        }}>
          CollabSphere is a student collaboration platform where students can discover project ideas, find teammates, organize their work, communicate, and showcase completed projects.
        </p>

        {/* 3 Simple Concepts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-2xl)',
          textAlign: 'center',
        }}>
          {concepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 90, 54, 0.1)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-md)',
                }}>
                  <Icon size={20} />
                </div>

                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-extrabold)',
                  letterSpacing: '0.1em',
                  color: 'var(--color-accent)',
                  marginBottom: 'var(--space-xs)',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </span>

                <p style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-main)',
                  margin: 0,
                  lineHeight: 'var(--line-height-normal)',
                }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
