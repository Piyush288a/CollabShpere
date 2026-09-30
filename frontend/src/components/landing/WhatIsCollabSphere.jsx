import React from 'react';
import '../../styles/global.css';

export const WhatIsCollabSphere = () => {
  const pillars = [
    {
      label: 'DISCOVER',
      description: 'Find projects worth building.',
    },
    {
      label: 'CONNECT',
      description: 'Find people who want to build them with you.',
    },
    {
      label: 'BUILD',
      description: 'Work together and turn ideas into projects.',
    },
  ];

  return (
    <section id="what-is-collabsphere" style={{
      paddingTop: 'clamp(var(--space-3xl), 6vw, var(--space-4xl))',
      paddingBottom: 'clamp(var(--space-3xl), 6vw, var(--space-4xl))',
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        {/* Section Heading */}
        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, var(--font-size-4xl))',
          marginBottom: 'var(--space-md)',
          letterSpacing: '-0.03em',
        }}>
          What is CollabSphere?
        </h2>

        {/* Short Paragraph */}
        <p style={{
          fontSize: 'clamp(var(--font-size-base), 1.8vw, var(--font-size-lg))',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: 'var(--space-3xl)',
        }}>
          CollabSphere is a student collaboration platform where students can discover project ideas, find teammates, organize their work, communicate, and showcase completed projects.
        </p>

        {/* 3 Simple Minimal Concepts (No Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-2xl)',
          textAlign: 'left',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-2xl)',
        }}>
          {pillars.map((item, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-xs)',
              }}>
                {item.label}
              </div>
              <p style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-main)',
                lineHeight: 'var(--line-height-snug)',
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
