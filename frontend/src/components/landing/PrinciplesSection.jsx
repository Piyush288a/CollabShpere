import React from 'react';
import { Quote, Sparkles, Shield, Rocket } from 'lucide-react';
import '../../styles/global.css';

export const PrinciplesSection = () => {
  const principles = [
    {
      icon: Rocket,
      quote: "Find people who want to build what you want to build.",
      detail: "Match with classmates based on genuine interest, shared project goals, and complementary tech stacks.",
    },
    {
      icon: Sparkles,
      quote: "Gain real-world team experience before graduation.",
      detail: "Practice team Git workflows, task delegation, and real-time communication on production-style codebases.",
    },
    {
      icon: Shield,
      quote: "Turn course assignments into portfolio-ready showcases.",
      detail: "Transform capstone projects into public showcases that stand out to future engineering recruiters.",
    },
  ];

  return (
    <section style={{
      paddingTop: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-3xl)' }}>
          <span className="section-tag">OUR PHILOSOPHY</span>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>
            Built Around Student Collaboration
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)' }}>
            Guiding principles that drive the CollabSphere platform experience.
          </p>
        </div>

        {/* 3 Principles Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-xl)',
        }}>
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <Quote size={28} color="var(--color-accent)" style={{ marginBottom: 'var(--space-md)', opacity: 0.6 }} />
                  <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-main)',
                    marginBottom: 'var(--space-md)',
                    lineHeight: 'var(--line-height-snug)',
                  }}>
                    "{item.quote}"
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    {item.detail}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  marginTop: 'var(--space-lg)',
                  color: 'var(--color-accent)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  <Icon size={16} />
                  <span>CollabSphere Core Pillar</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
