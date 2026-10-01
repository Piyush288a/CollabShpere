import React from 'react';
import { Users, ArrowUpRight } from 'lucide-react';
import '../../styles/global.css';

export const HeroMockup = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '520px',
      margin: '0 auto',
    }}>
      {/* Clean White Card */}
      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
        }}>
          <span className="badge">OPEN PROJECT</span>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-primary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)',
          }}>
            Web Development
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-main)',
          marginBottom: 'var(--space-xs)',
        }}>
          EcoTrack — Campus Energy Monitor
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-lg)',
          lineHeight: 'var(--line-height-normal)',
        }}>
          IoT dashboard for university dormitories measuring real-time power consumption and visualizing campus energy savings.
        </p>

        {/* Tech Stack Tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-lg)',
        }}>
          {['React', 'Node.js', 'Socket.IO', 'MongoDB'].map((tech) => (
            <span key={tech} style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-main)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Bottom Progress & Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-md)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            <Users size={15} color="var(--color-accent)" />
            3 of 4 Teammates Joined
          </div>

          <button className="btn btn-primary" style={{ padding: '0.4rem 0.95rem', fontSize: 'var(--font-size-xs)' }}>
            Request to Join
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
