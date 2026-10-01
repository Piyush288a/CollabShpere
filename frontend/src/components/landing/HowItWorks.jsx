import React from 'react';
import '../../styles/global.css';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Find project ideas worth building across campus.',
    },
    {
      number: '02',
      title: 'Connect',
      description: 'Message creators and form a balanced software team.',
    },
    {
      number: '03',
      title: 'Build',
      description: 'Collaborate with task tracking, chat, and team workspaces.',
    },
    {
      number: '04',
      title: 'Showcase',
      description: 'Publish your completed project to the campus feed.',
    },
  ];

  return (
    <section id="how-it-works" style={{
      paddingTop: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto var(--space-3xl)' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, var(--font-size-4xl))',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            marginBottom: 'var(--space-xs)',
          }}>
            How It Works
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)' }}>
            Four simple steps to turn student ideas into real software.
          </p>
        </div>

        {/* 4 Minimal Step Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-xl)',
        }}>
          {steps.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-sm)',
                letterSpacing: '-0.03em',
              }}>
                {item.number}
              </div>

              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--space-xs)',
                color: 'var(--color-text-main)',
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 'var(--line-height-normal)',
                margin: 0,
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
