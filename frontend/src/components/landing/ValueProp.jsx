import React from 'react';
import { Target, Users, Zap, Award } from 'lucide-react';
import { ValuePropMockup } from './ValuePropMockup';
import '../../styles/global.css';

export const ValueProp = () => {
  return (
    <section style={{
      paddingTop: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-3xl)',
          alignItems: 'center',
        }} className="value-prop-grid">
          {/* Left Column: Product Visual */}
          <div>
            <ValuePropMockup />
          </div>

          {/* Right Column: Narrative */}
          <div>
            <span className="section-tag">THE PROBLEM WE SOLVE</span>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>
              Great projects start with the right people.
            </h2>
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-xl)',
            }}>
              Students often have ambitious ideas for capstone projects, hackathons, or startup MVPs — but finding reliable teammates with complementary skills is frustratingly hard.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-lg)',
            }}>
              {[
                {
                  icon: Target,
                  title: 'Skill-Based Teammate Search',
                  desc: 'Find collaborators based on verified tech skills (React, Node, Python, UI/UX).',
                },
                {
                  icon: Users,
                  title: 'Streamlined Collaboration Requests',
                  desc: 'Project owners review requests, check applicant profiles, and accept members seamlessly.',
                },
                {
                  icon: Zap,
                  title: 'Centralized Project Workspace',
                  desc: 'Manage tasks and communicate in real time without fragmenting across 5 different apps.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-accent-soft)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: '2px',
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .value-prop-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
