import React from 'react';
import { Compass, Users, Code2, Cpu, Zap, ShieldCheck } from 'lucide-react';
import '../../styles/global.css';

export const WhatIsCollabSphere = () => {
  const concepts = [
    {
      icon: Compass,
      label: 'DISCOVER_MATRIX',
      description: 'Filter real-time campus initiatives by technical difficulty, architecture domains, and engineering stacks.',
      color: 'var(--color-cyan)',
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.3)',
    },
    {
      icon: Users,
      label: 'RECRUIT_PEERS',
      description: 'Review applicant skill profiles, verify capacities, and synchronize team rosters automatically.',
      color: 'var(--color-accent)',
      bg: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.35)',
    },
    {
      icon: Cpu,
      label: 'EXECUTE_WORKSPACE',
      description: 'Stream instant WebSocket chat packets and drive task state machines in private encrypted workspaces.',
      color: 'var(--color-emerald)',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
  ];

  return (
    <section id="what-is-collabsphere" style={{
      paddingTop: 'clamp(var(--space-4xl), 6vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-4xl), 6vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
    }}>
      <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
        {/* Section Pill */}
        <span className="badge badge-cyan" style={{ marginBottom: 'var(--space-md)' }}>
          CORE_ARCHITECTURE
        </span>

        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4.5vw, var(--font-size-4xl))',
          fontWeight: 'var(--font-weight-extrabold)',
          color: '#FFFFFF',
          marginBottom: 'var(--space-md)',
          letterSpacing: '-0.03em',
        }}>
          What is CollabSphere?
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 'clamp(var(--font-size-base), 2vw, var(--font-size-lg))',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--line-height-relaxed)',
          maxWidth: '740px',
          margin: '0 auto clamp(var(--space-2xl), 5vw, var(--space-4xl))',
        }}>
          A synchronized university ecosystem bridging project owners and student engineers with high-frequency messaging, state-locked tasks, and public showcase networks.
        </p>

        {/* 3 Tech Architecture Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-xl)',
          textAlign: 'left',
        }}>
          {concepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(22, 29, 45, 0.65)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${item.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  transition: 'all var(--transition-normal)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px ${item.border}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-lg)',
                  border: `1px solid ${item.border}`,
                }}>
                  <Icon size={24} />
                </div>

                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}>
                  {item.label}
                </h3>

                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
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
