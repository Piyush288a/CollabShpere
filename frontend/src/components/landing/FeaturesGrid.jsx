import React from 'react';
import { Compass, UserCheck, Kanban, ArrowUpRight } from 'lucide-react';
import '../../styles/global.css';

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Compass,
      tag: 'DISCOVERY',
      title: 'Discover Projects',
      description: 'Search open project ideas by tech stack, difficulty, and domain category. Find projects actively looking for your skill set.',
      points: ['Skill-based search & filtering', 'Difficulty levels (Beginner to Advanced)', 'Bookmark projects for later'],
    },
    {
      icon: UserCheck,
      tag: 'TEAM FORMATION',
      title: 'Build Your Team',
      description: 'Send collaboration requests to project creators with personalized pitch messages. Manage applications with capacity limits.',
      points: ['Structured collaboration requests', 'Owner accept/reject decisions', 'Automatic team member synchronization'],
    },
    {
      icon: Kanban,
      tag: 'WORKSPACE',
      title: 'Work Together',
      description: 'Collaborate inside a dedicated team workspace. Track task progress on Kanban-style boards and chat in real time.',
      points: ['Task status flow (TODO → IN_PROGRESS → COMPLETED)', 'Team-member exclusive workspace', 'Socket.IO real-time instant messaging'],
    },
  ];

  return (
    <section id="features" style={{
      paddingTop: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-surface)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-3xl)' }}>
          <span className="section-tag">CORE PLATFORM FEATURES</span>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>
            Everything You Need to Build Together
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)' }}>
            CollabSphere streamlines the complete project lifecycle from initial idea discovery to final campus showcase.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-xl)',
        }}>
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
                <div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-accent-soft)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-lg)',
                  }}>
                    <Icon size={24} />
                  </div>

                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-accent)',
                    letterSpacing: '0.05em',
                  }}>
                    {item.tag}
                  </span>

                  <h3 style={{
                    fontSize: 'var(--font-size-xl)',
                    marginBottom: 'var(--space-sm)',
                    marginTop: '4px',
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-lg)',
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: 'var(--space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-xs)',
                }}>
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-main)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
