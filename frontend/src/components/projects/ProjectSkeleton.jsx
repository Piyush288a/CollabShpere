import React from 'react';

export const ProjectSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: '60px', height: '18px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px' }} />
              <div style={{ width: '80px', height: '18px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px' }} />
            </div>
            <div style={{ width: '70%', height: '22px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px', marginBottom: 'var(--space-md)' }} />
            <div style={{ width: '95%', height: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ width: '80%', height: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-md)' }}>
            <div style={{ width: '100px', height: '16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px' }} />
            <div style={{ width: '90px', height: '28px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};
