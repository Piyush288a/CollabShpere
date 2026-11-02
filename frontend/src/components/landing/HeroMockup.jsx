import React from 'react';
import { Users, ArrowUpRight, Cpu, Terminal, Radio } from 'lucide-react';
import '../../styles/global.css';

export const HeroMockup = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '560px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Glow Backdrop */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
        filter: 'blur(30px)',
        zIndex: 0,
      }} />

      {/* High-Tech Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(17, 22, 34, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.15)',
        textAlign: 'left',
      }}>
        {/* Card Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
          paddingBottom: 'var(--space-sm)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-emerald)',
              boxShadow: '0 0 8px var(--color-emerald)',
            }} />
            <span className="badge badge-indigo">DIRECTIVE #7402</span>
          </div>

          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
          }}>
            CYBER_SYSTEMS
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-extrabold)',
          color: '#FFFFFF',
          marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}>
          NeuralMesh — Decentralized Sensor Stream
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-lg)',
          lineHeight: 'var(--line-height-relaxed)',
        }}>
          High-throughput telemetry pipeline aggregating IoT node telemetry with low-latency WebSockets and edge clustering algorithms.
        </p>

        {/* Tech Stack Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-xl)',
        }}>
          {['React 18', 'Node.js', 'Socket.IO', 'MongoDB', 'Redis'].map((tech) => (
            <span key={tech} style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'rgba(22, 29, 45, 0.8)',
              color: 'var(--color-cyan)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Card Footer Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--color-cyan)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              CAPACITY: <strong style={{ color: '#FFFFFF' }}>3 / 5 SLOTS</strong>
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            fontWeight: 'bold',
          }}>
            <span>TRANSMIT_REQUEST</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
