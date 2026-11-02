import React from 'react';
import { Heart, MessageCircle, ExternalLink, Github, Sparkles } from 'lucide-react';
import '../../styles/global.css';

export const ShowcaseSection = () => {
  const showcases = [
    {
      title: 'EcoTrack — Campus Energy Monitor',
      description: 'An IoT dashboard for university dormitories measuring real-time power consumption and visualizing campus energy savings.',
      tech: ['React', 'Node.js', 'Socket.IO', 'IoT'],
      author: 'Jane Smith & Team',
      likes: 42,
      comments: 14,
      gradient: 'linear-gradient(135deg, #FF5A36 0%, #FF9F43 100%)',
    },
    {
      title: 'StudySync — Peer Study Groups',
      description: 'Real-time collaborative study session finder allowing students to match by subject, course code, and exam schedules.',
      tech: ['React', 'MongoDB', 'Express', 'Tailwind'],
      author: 'Alex Kumar & Team',
      likes: 38,
      comments: 9,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
    },
    {
      title: 'DevPortfolio — AI Resume Generator',
      description: 'Automated software project portfolio generator that analyzes GitHub repositories and creates hosted student portfolios.',
      tech: ['Python', 'React', 'Vite', 'OpenAI'],
      author: 'Piyush Sharma',
      likes: 56,
      comments: 21,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
  ];

  return (
    <section id="showcases" style={{
      paddingTop: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 8vw, var(--space-5xl))',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-3xl)' }}>
          <span className="section-tag">CAMPUS SHOWCASE</span>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>
            See What Students Are Building
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)' }}>
            Explore completed software projects published by student teams across campus.
          </p>
        </div>

        {/* 3 Showcase Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-xl)',
        }}>
          {showcases.map((item, idx) => (
            <div key={idx} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 0,
              overflow: 'hidden',
            }}>
              {/* Visual Cover Header */}
              <div style={{
                height: '160px',
                background: item.gradient,
                padding: 'var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    COMPLETED PROJECT
                  </span>
                  <ExternalLink size={18} />
                </div>
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-lg)', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: 'var(--space-xl)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-lg)',
                    lineHeight: 'var(--line-height-normal)',
                  }}>
                    {item.description}
                  </p>

                  {/* Tech Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
                    {item.tech.map((t, tIdx) => (
                      <span key={tIdx} style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-main)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--color-border-subtle)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Social Stats */}
                <div style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: 'var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-subtle)',
                }}>
                  <span>By {item.author}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                      <Heart size={14} fill="var(--color-accent)" /> {item.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={14} /> {item.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
