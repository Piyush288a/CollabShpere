import React from 'react';
import { Users, Code2, ArrowUpRight, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import '../../styles/global.css';

export const HeroMockup = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '560px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Outer Card Wrapper with Glow */}
      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Top Accent Bar */}
        <div style={{
          height: '4px',
          backgroundColor: 'var(--color-accent)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }} />

        {/* Card Header: Project Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: '4px' }}>
              <span className="badge">OPEN FOR COLLABORATION</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>• Web Dev</span>
            </div>
            <h4 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
            }}>
              EcoTrack — Campus Energy Monitor
            </h4>
          </div>

          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-muted)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border-subtle)',
          }}>
            Intermediate
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-lg)',
          lineHeight: 'var(--line-height-normal)',
        }}>
          Building an IoT dashboard for university dormitories to measure real-time power consumption and visualize energy savings.
        </p>

        {/* Required Skills Tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-xl)',
        }}>
          {['React', 'Node.js', 'Socket.IO', 'Tailwind', 'MongoDB'].map((skill) => (
            <span key={skill} style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-main)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Team Progress & Members */}
        <div style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid var(--color-border-subtle)',
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-subtle)',
              marginBottom: '2px',
              fontWeight: 'var(--font-weight-medium)',
            }}>
              Team Capacity
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
            }}>
              <Users size={16} color="var(--color-accent)" />
              3 of 4 Members Joined
            </div>
          </div>

          {/* Member Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['#FF5A36', '#3B82F6', '#10B981'].map((color, idx) => (
              <div key={idx} style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: color,
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                marginLeft: idx > 0 ? '-8px' : 0,
              }}>
                {['JS', 'AK', 'PR'][idx]}
              </div>
            ))}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-subtle)',
              border: '2px dashed var(--color-border)',
              marginLeft: '-8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Plus size={14} />
            </div>
          </div>
        </div>

        {/* Mock Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
            }} />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              1 Pending Request
            </span>
          </div>

          <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: 'var(--font-size-xs)' }}>
            Request to Join
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Floating Mini Notification Badge */}
      <div style={{
        position: 'absolute',
        bottom: '-16px',
        right: '-16px',
        backgroundColor: 'var(--color-dark)',
        color: 'var(--color-text-dark-main)',
        padding: 'var(--space-sm) var(--space-md)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-semibold)',
        border: '1px solid var(--color-dark-border)',
      }}>
        <CheckCircle2 size={16} color="var(--color-success)" />
        Request Accepted! Joined workspace
      </div>
    </div>
  );
};
