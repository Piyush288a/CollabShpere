import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/project.service';
import { collaborationService } from '../services/collaboration.service';
import { TeamMembers } from '../components/projects/TeamMembers';
import { ProjectRequestsList } from '../components/projects/ProjectRequestsList';
import { ROUTES } from '../constants/routes.constants';
import {
  ArrowLeft,
  Users,
  Calendar,
  ExternalLink,
  Code2,
  Layers,
  FolderX,
  LayoutDashboard,
  Send,
  Clock,
  UserCheck,
  Crown,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import '../styles/global.css';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request form state
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data.project);
    } catch (err) {
      console.error('Failed to load project details:', err);
      setError(err.message || 'Project not found or unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestError(null);
    setIsSubmittingRequest(true);

    try {
      await collaborationService.createRequest(id, requestMessage.trim());
      setRequestSuccess(true);
      setRequestMessage('');
    } catch (err) {
      console.error('Failed to submit collaboration request:', err);
      // Display friendly error message from backend (e.g. 409 duplicate request)
      setRequestError(err.message || 'Failed to submit collaboration request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

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
        <div className="container" style={{ maxWidth: '880px' }}>
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

  if (error || !project) {
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
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)',
            }}>
              <FolderX size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-xs)' }}>
              Project Not Found
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
              {error || 'The project you are looking for does not exist or has been removed.'}
            </p>
            <Link to={ROUTES.PROJECTS} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              <ArrowLeft size={16} />
              Back to Discover Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolve user relationship
  const currentUserId = user?._id || user?.id;
  const ownerId = typeof project.ownerId === 'object' ? project.ownerId?._id : project.ownerId;
  const isOwner = currentUserId && String(ownerId) === String(currentUserId);
  const memberIds = project.memberIds || [];
  const isMember = currentUserId && memberIds.some((m) => String(m) === String(currentUserId));
  const memberCount = memberIds.length || 1;
  const isTeamFull = memberCount >= project.teamSize;
  const isProjectOpen = project.status === 'OPEN';

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-5xl)',
    }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Navigation Back Link */}
        <Link
          to={ROUTES.PROJECTS}
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
          Back to Projects
        </Link>

        {/* Main Project Card */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 'var(--space-2xl)',
        }}>
          {/* Header Status & Categories */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)',
          }}>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: project.status === 'OPEN' ? '#10B981' : project.status === 'IN_PROGRESS' ? '#3B82F6' : '#6C655F',
              backgroundColor: project.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : project.status === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(108, 101, 95, 0.1)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em',
              border: '1px solid var(--color-border-subtle)',
            }}>
              STATUS: {project.status}
            </span>

            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
              <span style={badgeStyle}>
                <Layers size={13} color="var(--color-accent)" />
                {project.category}
              </span>
              <span style={badgeStyle}>
                {project.difficulty}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, var(--font-size-4xl))',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.03em',
            lineHeight: 'var(--line-height-snug)',
            marginBottom: 'var(--space-lg)',
          }}>
            {project.title}
          </h1>

          {/* Key Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-md)',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
            marginBottom: 'var(--space-2xl)',
          }}>
            <div>
              <span style={metaLabelStyle}>Team Capacity</span>
              <div style={metaValueStyle}>
                <Users size={16} color="var(--color-accent)" />
                {memberCount} / {project.teamSize} Members
              </div>
            </div>

            <div>
              <span style={metaLabelStyle}>Target Deadline</span>
              <div style={metaValueStyle}>
                <Calendar size={16} color="var(--color-accent)" />
                {formatDate(project.deadline)}
              </div>
            </div>

            <div>
              <span style={metaLabelStyle}>Posted On</span>
              <div style={metaValueStyle}>
                {formatDate(project.createdAt)}
              </div>
            </div>
          </div>

          {/* Workspace Action Banner for Owner / Members */}
          {(isOwner || isMember) && (
            <div style={{
              backgroundColor: 'var(--color-accent-soft)',
              border: '1px solid var(--color-accent-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-md)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                {isOwner ? (
                  <Crown size={20} color="var(--color-accent)" />
                ) : (
                  <UserCheck size={20} color="var(--color-accent)" />
                )}
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>
                    {isOwner ? 'You are the project owner' : 'You are an accepted team member'}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Access your team workspace to view project overview and details.
                  </div>
                </div>
              </div>

              <Link
                to={`/projects/${project._id}/workspace`}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.1rem', fontSize: 'var(--font-size-xs)' }}
              >
                <LayoutDashboard size={15} />
                Open Team Workspace
              </Link>
            </div>
          )}

          {/* Description Section */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h3 style={sectionHeadingStyle}>About the Project</h3>
            <div style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-main)',
              lineHeight: 'var(--line-height-relaxed)',
              whiteSpace: 'pre-wrap',
            }}>
              {project.description}
            </div>
          </div>

          {/* Required Skills Section */}
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3 style={sectionHeadingStyle}>
                <Code2 size={16} color="var(--color-accent)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Required Technologies & Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {project.requiredSkills.map((skill, idx) => (
                  <span key={idx} style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-main)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repository Link (if present) */}
          {project.repositoryUrl && (
            <div style={{
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--color-border-subtle)',
              marginBottom: 'var(--space-2xl)',
            }}>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                View Repository
                <ExternalLink size={15} />
              </a>
            </div>
          )}

          {/* Team Roster Section */}
          <div style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: 'var(--space-2xl)',
          }}>
            <h3 style={{ ...sectionHeadingStyle, marginBottom: 'var(--space-md)' }}>
              <Users size={18} color="var(--color-accent)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Team Roster
            </h3>
            <TeamMembers projectId={project._id} ownerId={ownerId} />
          </div>
        </div>

        {/* OWNER MANAGEMENT SECTION */}
        {isOwner && (
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--space-2xl)',
          }}>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h3 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-main)',
                marginBottom: '2px',
              }}>
                Pending Collaboration Requests
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                Review and accept student requests to join your project team.
              </p>
            </div>

            <ProjectRequestsList projectId={project._id} onRequestDecided={fetchProject} />
          </div>
        )}

        {/* NON-OWNER / NON-MEMBER COLLABORATION ACTION SECTION */}
        {!isOwner && !isMember && (
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {requestSuccess ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                textAlign: 'center',
              }}>
                <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto var(--space-xs)' }} />
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: '#047857', marginBottom: 'var(--space-xs)' }}>
                  Request Submitted Successfully
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Your request to join this project has been sent. The project owner will review your application.
                </p>
              </div>
            ) : !isProjectOpen ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-lg)' }}>
                <Clock size={24} style={{ margin: '0 auto var(--space-xs)', color: 'var(--color-text-subtle)' }} />
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', marginBottom: '4px' }}>
                  Collaboration Closed
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>
                  This project is currently not accepting new collaboration requests.
                </div>
              </div>
            ) : isTeamFull ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-lg)' }}>
                <Users size={24} style={{ margin: '0 auto var(--space-xs)', color: 'var(--color-text-subtle)' }} />
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', marginBottom: '4px' }}>
                  Team Full Capacity
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>
                  This project team has reached its maximum capacity of {project.teamSize} members.
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSendRequest}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <h3 style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-main)',
                    marginBottom: 'var(--space-xs)',
                  }}>
                    Request to Collaborate
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                    Introduce yourself to the project owner and share why you'd like to build together.
                  </p>
                </div>

                {requestError && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md) var(--space-lg)',
                    marginBottom: 'var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    color: '#B91C1C',
                    fontSize: 'var(--font-size-sm)',
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{requestError}</span>
                  </div>
                )}

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label htmlFor="requestMessage" style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--space-xs)',
                  }}>
                    Pitch / Message <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                  </label>
                  <textarea
                    id="requestMessage"
                    rows={3}
                    maxLength={1000}
                    placeholder="Mention your technical skills or background relevant to this project..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="form-control"
                    style={{
                      width: '100%',
                      fontSize: 'var(--font-size-sm)',
                      borderRadius: 'var(--radius-md)',
                      lineHeight: 'var(--line-height-normal)',
                      paddingTop: 'var(--space-sm)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', minWidth: '160px', justifyContent: 'center' }}
                >
                  {isSubmittingRequest ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Collaboration Request
                    </>
                  )}
                </button>
              </form>
            )}
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
  padding: '4px 10px',
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

const sectionHeadingStyle = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-main)',
  marginBottom: 'var(--space-sm)',
};
