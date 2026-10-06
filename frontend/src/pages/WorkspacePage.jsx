import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/project.service';
import { TeamMembers } from '../components/projects/TeamMembers';
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
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
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
  const isOwner = currentUserId && String(ownerId) === String(currentUserId);
  const memberIds = project?.memberIds || [];
  const isMember = currentUserId && memberIds.some((m) => String(m) === String(currentUserId));
  const isAuthorized = isOwner || isMember;

  if (error || !project || !isAuthorized) {
    return (
      <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4xl) var(--space-xl)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)',
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-xs)' }}>
              Workspace Access Restricted
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
              This team workspace is private and accessible only to accepted project team members.
            </p>
            <Link to={`/projects/${id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              <ArrowLeft size={16} />
              Back to Project Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberCount = memberIds.length || 1;

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-5xl)',
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Navigation Back Link */}
        <Link
          to={`/projects/${project._id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-xl)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Project Details
        </Link>

        {/* Workspace Header */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-2xl))',
          marginBottom: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
          }}>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: project.status === 'OPEN' ? '#10B981' : project.status === 'IN_PROGRESS' ? '#3B82F6' : '#6C655F',
              backgroundColor: project.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : project.status === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(108, 101, 95, 0.1)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em',
            }}>
              STATUS: {project.status}
            </span>

            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <span style={badgeStyle}>
                <Layers size={13} color="var(--color-accent)" />
                {project.category}
              </span>
              <span style={badgeStyle}>
                {project.difficulty}
              </span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--font-size-3xl))',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.025em',
            marginBottom: 'var(--space-xs)',
          }}>
            {project.title} — Team Workspace
          </h1>

          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            Dedicated collaboration environment for accepted team members.
          </p>

          {/* Sub-Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: 'var(--space-md)',
          }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: activeTab === 'overview' ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: activeTab === 'overview' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: activeTab === 'overview' ? 'var(--color-accent-soft)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <LayoutDashboard size={15} />
              Overview
            </button>

            <button
              disabled
              title="Tasks unlock in upcoming platform updates"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-subtle)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              <CheckSquare size={15} />
              Tasks (Coming Soon)
            </button>

            <button
              disabled
              title="Messages unlock in upcoming platform updates"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-subtle)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              <MessageSquare size={15} />
              Messages (Coming Soon)
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB CONTENT */}
        {activeTab === 'overview' && (
          <div>
            {/* Context Banner */}
            <div style={{
              backgroundColor: 'var(--color-accent-soft)',
              border: '1px solid var(--color-accent-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-sm)',
            }}>
              <Sparkles size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                  Team Overview Active
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-normal)' }}>
                  Welcome to your project workspace. Team roster, repository links, and scope details are available below. Real-time chat and task boards will unlock in upcoming platform updates.
                </div>
              </div>
            </div>

            {/* Key Workspace Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-md)',
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-2xl)',
            }}>
              <div>
                <span style={metaLabelStyle}>Team Roster</span>
                <div style={metaValueStyle}>
                  <Users size={16} color="var(--color-accent)" />
                  {memberCount} / {project.teamSize} Members Active
                </div>
              </div>

              <div>
                <span style={metaLabelStyle}>Target Deadline</span>
                <div style={metaValueStyle}>
                  <Calendar size={16} color="var(--color-accent)" />
                  {formatDate(project.deadline)}
                </div>
              </div>

              {project.repositoryUrl && (
                <div>
                  <span style={metaLabelStyle}>Code Repository</span>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                    }}
                  >
                    Open GitHub Repo
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>

            {/* Project Description Block */}
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              marginBottom: 'var(--space-2xl)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-sm)' }}>
                Project Overview & Requirements
              </h3>
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-main)', lineHeight: 'var(--line-height-relaxed)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {project.description}
              </p>
            </div>

            {/* Team Roster Block */}
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-lg)' }}>
                Team Members
              </h3>
              <TeamMembers projectId={project._id} ownerId={ownerId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-main)',
  backgroundColor: 'var(--color-bg-primary)',
  padding: '3px 9px',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid var(--color-border-subtle)',
  fontWeight: 'var(--font-weight-medium)',
};

const metaLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  fontWeight: 'var(--font-weight-medium)',
  display: 'block',
  marginBottom: '4px',
};

const metaValueStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-main)',
};
