import React from 'react';
import { Code, Users, Cpu, Globe, Rocket, ShieldCheck } from 'lucide-react';
import '../../styles/global.css';

export const TrustStrip = () => {
  const concepts = [
    { icon: Code, label: 'Project Collaboration' },
    { icon: Users, label: 'Team Building' },
    { icon: Cpu, label: 'Student Innovation' },
    { icon: Globe, label: 'Open Source' },
    { icon: Rocket, label: 'Campus Projects' },
    { icon: ShieldCheck, label: 'Tech Communities' },
  ];

  return (
    <div style={{
      borderTop: '1px solid var(--color-border-subtle)',
      borderBottom: '1px solid var(--color-border-subtle)',
      backgroundColor: 'var(--color-bg-surface)',
      padding: 'var(--space-xl) 0',
    }}>
      <div className="container">
        <p style={{
          textAlign: 'center',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--space-lg)',
        }}>
          Empowering modern university collaboration ecosystems
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(var(--space-md), 3vw, var(--space-3xl))',
        }}>
          {concepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                opacity: 0.8,
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <Icon size={18} color="var(--color-accent)" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
