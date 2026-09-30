import React from 'react';
import '../../styles/global.css';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover Ideas',
      description: 'Browse student project proposals or post your own project idea requiring specific technical skills.',
    },
    {
      number: '02',
      title: 'Connect & Form Team',
      description: 'Send collaboration requests with personalized pitch messages and build a balanced software team.',
    },
    {
      number: '03',
      title: 'Build Together',
      description: 'Manage task boards, assign responsibilities, and chat in real time inside your project workspace.',
    },
    {
      number: '04',
      title: 'Showcase Finished Work',
      description: 'Publish completed software to the campus showcase feed, gather peer likes, and receive feedback.',
    },
  ];

  return (
    <section id="how-it-works" style={{
      paddingTop: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-3xl)' }}>
          <span className="section-tag">WORKFLOW</span>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>
            Four steps to launch your project
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)' }}>
            A structured journey taking student ideas from concept to campus-wide showcase.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-xl)',
        }}>
          {steps.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-md)',
                letterSpacing: '-0.03em',
              }}>
                {item.number}
              </div>

              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                marginBottom: 'var(--space-xs)',
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 'var(--line-height-normal)',
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
