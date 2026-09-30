import React from 'react';
import { Search, UserPlus, Check, Filter } from 'lucide-react';
import '../../styles/global.css';

export const ValuePropMockup = () => {
  return (
    <div style={{
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-xl)',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
    }}>
      {/* Search Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem var(--space-md)',
        marginBottom: 'var(--space-lg)',
      }}>
        <Search size={16} color="var(--color-text-subtle)" />
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', flex: 1 }}>
          Search collaborators by skill: "React", "Python", "UI/UX"...
        </span>
        <Filter size={16} color="var(--color-accent)" />
      </div>

      {/* Candidate Card 1 */}
      <div style={{
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-bg-surface)',
        marginBottom: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-sm)',
          }}>
            JS
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>
              Jane Smith
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Full-Stack Developer • 4 Projects Completed
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: 'var(--font-size-xs)' }}>
          <UserPlus size={14} />
          Invite
        </button>
      </div>

      {/* Candidate Card 2 */}
      <div style={{
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: 0.9,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-sm)',
          }}>
            AK
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>
              Alex Kumar
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              UI/UX Designer & Figma Specialist
            </div>
          </div>
        </div>

        <span style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Check size={14} />
          Accepted
        </span>
      </div>
    </div>
  );
};
