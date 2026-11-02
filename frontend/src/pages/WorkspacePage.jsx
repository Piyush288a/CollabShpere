import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/project.service';
import { TeamMembers } from '../components/projects/TeamMembers';
import { TaskList } from '../components/tasks/TaskList';
import { MessageList } from '../components/messaging/MessageList';
import { ROUTES } from '../constants/routes.constants';
import {
  ArrowLeft,
  Users,
  Calendar,
  ExternalLink,
  Code2,
  Layers,
  Lock,
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Cpu,
  Terminal,
  Activity,
  AlertCircle
} from 'lucide-react';
import '../styles/global.css';

export const WorkspacePage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data.project);
    } catch (err) {
      console.error('Failed to load workspace project:', err);
      setError(err.message || 'Workspace unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{
            backgroundColor: 'rgba(22, 29, 45, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-3xl)',
            height: '380px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    );
  }

  // Resolve authorization
  const currentUserId = user?._id || user?.id;
  const ownerId = typeof project?.ownerId === 'object' ? project?.ownerId?._id : project?.ownerId;
  const memberIds = project?.memberIds || [];

  const isOwner = String(ownerId) === String(currentUserId);
  const isMember = memberIds.some((m) => {
    const mId = typeof m === 'object' ? m?._id : m;
    return String(mId) === String(currentUserId);
  });
  const hasAccess = isOwner || isMember || user?.role === 'admin';

  if (error || !project) {
    return (
      <div style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-5xl)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <AlertCircle size={48} color="#f87171" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Workspace Access Denied</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            {error || 'The requested project could not be found or access has been restricted.'}
          </p>
          <Link to={ROUTES.DASHBOARD} className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-5xl)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171',
            margin: '0 auto 16px',
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Restricted Perimeter</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            This workspace contains private project deliverables. Only verified team members and the project creator are authorized.
          </p>
          <Link to={ROUTES.PROJECT_DETAIL(id)} className="btn btn-secondary">
            View Public Project Proposal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-5xl)' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link
            to={ROUTES.DASHBOARD}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={14} /> BACK_TO_DASHBOARD
          </Link>
        </div>

        {/* High-Tech Workspace Banner */}
        <div style={{
          backgroundColor: 'rgba(17, 22, 34, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
          marginBottom: 'var(--space-2xl)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle Cyber Top Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--gradient-cyber)',
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-lg)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">SECURE_WORKSPACE</span>
                <span className="badge badge-indigo">{project.status}</span>
                {isOwner && <span className="badge badge-amber">CREATOR_NODE</span>}
              </div>

              <h1 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
              }}>
                {project.title}
              </h1>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="var(--color-cyan)" />
                  <span>{project.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="var(--color-accent)" />
                  <span>TEAM: {(project.memberIds?.length || 0)} / {project.teamSize}</span>
                </div>
                {project.deadline && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--color-amber)" />
                    <span>TARGET: {formatDate(project.deadline)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={ROUTES.PROJECT_DETAIL(id)}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              >
                <ExternalLink size={14} /> PUBLIC_VIEW
              </Link>
            </div>
          </div>
        </div>

        {/* High-Tech Tab Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 'var(--space-2xl)',
          paddingBottom: '8px',
        }}>
          {[
            { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
            { id: 'tasks', label: 'DIRECTIVES & TASKS', icon: CheckSquare },
            { id: 'messages', label: 'QUANTUM CHAT', icon: MessageSquare },
            { id: 'team', label: 'TEAM ROSTER', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--color-cyan)' : '1px solid transparent',
                  backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={15} color={isSelected ? 'var(--color-cyan)' : 'currentColor'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'overview' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-2xl)',
            }}>
              {/* Project Specs */}
              <div style={{
                backgroundColor: 'rgba(22, 29, 45, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-cyan)',
                  marginBottom: 'var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Terminal size={16} /> SPECIFICATION_SUMMARY
                </h3>

                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-main)',
                  lineHeight: 'var(--line-height-relaxed)',
                  marginBottom: 'var(--space-xl)',
                }}>
                  {project.description}
                </p>

                <h4 style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)',
                  marginBottom: '10px',
                }}>
                  REQUIRED_SKILL_MATRIX
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(project.requiredSkills || []).map((skill) => (
                    <span key={skill} className="badge badge-cyan">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workspace Roster Snippet */}
              <div>
                <TeamMembers projectId={id} isOwner={isOwner} />
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskList projectId={id} isOwner={isOwner} />
          )}

          {activeTab === 'messages' && (
            <MessageList projectId={id} />
          )}

          {activeTab === 'team' && (
            <div style={{ maxWidth: '720px' }}>
              <TeamMembers projectId={id} isOwner={isOwner} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
