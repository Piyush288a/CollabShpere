import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, CheckSquare, Layers, ShieldCheck, Sparkles, Send, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes.constants';
import '../../styles/global.css';

export const DarkShowcase = () => {
  const darkFeatures = [
    {
      icon: LayoutDashboard,
      title: 'Project Workspace Dashboard',
      description: 'Dedicated team-only workspace isolating tasks, chat, and member permissions per project.',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>PROJECT STATUS</span>
            <span style={{ fontSize: '11px', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '10px' }}>IN_PROGRESS</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF' }}>Smart Campus Parking Platform</div>
          <div style={{ fontSize: '11px', color: '#A8A096', marginTop: '4px' }}>4 Members • Deadline Oct 28</div>
        </div>
      ),
    },
    {
      icon: CheckSquare,
      title: 'Task Management Engine',
      description: 'Structured task board with strict forward-only transitions (TODO → IN_PROGRESS → COMPLETED).',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', backgroundColor: '#3B82F6', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>TODO: 2</span>
            <span style={{ fontSize: '10px', backgroundColor: '#F59E0B', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>DOING: 3</span>
            <span style={{ fontSize: '10px', backgroundColor: '#10B981', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>DONE: 7</span>
          </div>
          <div style={{ fontSize: '12px', color: '#FAF8F5', fontWeight: 'bold' }}>Setup MongoDB Schema</div>
          <div style={{ fontSize: '10px', color: '#A8A096', marginTop: '2px' }}>Assigned to: Jane Smith</div>
        </div>
      ),
    },
    {
      icon: MessageSquare,
      title: 'Socket.IO Real-Time Chat',
      description: 'Instant WebSocket message broadcasts bound to authenticated team members only.',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ fontSize: '11px', color: '#A8A096', marginBottom: '6px' }}># team-chat</div>
          <div style={{ backgroundColor: 'rgba(255,90,54,0.15)', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: '#FFF', marginBottom: '4px' }}>
            <strong style={{ color: 'var(--color-accent)' }}>Alex:</strong> Just pushed the API endpoints!
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="text" readOnly value="Type a message..." style={{ backgroundColor: '#2C2723', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: '#888', flex: 1 }} />
            <Send size={12} color="var(--color-accent)" />
          </div>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: 'Moderation & Safety',
      description: 'Admin audit logs, user reporting system, and instant session invalidation for suspended accounts.',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10B981', fontWeight: 'bold' }}>
            <ShieldCheck size={14} /> Security Middleware Active
          </div>
          <div style={{ fontSize: '10px', color: '#A8A096', marginTop: '4px' }}>JWT Verification • Rate Limiting • OWASP Sanitized</div>
        </div>
      ),
    },
    {
      icon: Layers,
      title: 'Project Showcase Feed',
      description: 'Publish completed software to the university feed with likes, bookmarks, and peer comments.',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF' }}>Campus Event Finder App</div>
          <div style={{ fontSize: '10px', color: 'var(--color-accent)', marginTop: '2px' }}>❤️ 24 Likes • 💬 8 Comments</div>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: 'Skill-Matching Algorithm',
      description: 'Find student collaborators by filtering matching skill tags and project domain requirements.',
      mockup: (
        <div style={{
          backgroundColor: '#1E1A17',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-dark-border)',
        }}>
          <div style={{ fontSize: '11px', color: '#FAF8F5', fontWeight: 'bold' }}>Match Score: 94%</div>
          <div style={{ fontSize: '10px', color: '#A8A096', marginTop: '2px' }}>Matches: React, Node.js, Express</div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="bg-dark-grid" style={{
      backgroundColor: 'var(--color-dark)',
      color: 'var(--color-text-dark-main)',
      paddingTop: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      paddingBottom: 'clamp(var(--space-3xl), 7vw, var(--space-5xl))',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-3xl)' }}>
          <span className="section-tag" style={{ color: 'var(--color-accent)' }}>
            CORE PLATFORM FEATURES
          </span>
          <h2 style={{ color: 'var(--color-text-dark-main)', marginBottom: 'var(--space-md)' }}>
            From Idea to Finished Project
          </h2>
          <p style={{ color: 'var(--color-text-dark-muted)', fontSize: 'var(--font-size-base)' }}>
            Everything standard student groups need to build, organize, communicate, and showcase high-impact software.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {darkFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-dark" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 90, 54, 0.15)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                  }}>
                    <Icon size={19} />
                  </div>

                  <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-dark-main)',
                    marginBottom: 'var(--space-xs)',
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-dark-muted)',
                    marginBottom: 'var(--space-lg)',
                    lineHeight: 'var(--line-height-normal)',
                  }}>
                    {item.description}
                  </p>
                </div>

                {item.mockup}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: 'var(--font-size-base)' }}>
            Start Building Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
