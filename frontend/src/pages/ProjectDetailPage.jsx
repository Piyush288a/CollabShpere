import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/project.service';
import { collaborationService } from '../services/collaboration.service';
import { socketService } from '../services/socket.service';
import { TeamMembers } from '../components/projects/TeamMembers';
import { ProjectRequestsList } from '../components/projects/ProjectRequestsList';
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
  FolderX,
  LayoutDashboard,
  Send,
  Clock,
  UserCheck,
  Crown,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  CheckSquare,
  MessageSquare,
  Inbox,
  Lock,
  ChevronRight,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import '../styles/global.css';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active navigation section: 'workspace' | 'tasks' | 'messages' | 'requests'
  const [activeSection, setActiveSection] = useState('workspace');

  // Sub-tab under Requests section
  // For owner: 'incoming' | 'all'
  // For applicant: 'send' | 'my_status'
  const [requestSubTab, setRequestSubTab] = useState('default');

  // Request form state (sender)
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  // Applicant's existing request from database
  const [myRequest, setMyRequest] = useState(null);
  const [isLoadingMyRequest, setIsLoadingMyRequest] = useState(false);

  // Owner's pending requests count
  const [pendingCount, setPendingCount] = useState(0);

  const currentUserId = user?._id || user?.id;
  const ownerId = typeof project?.ownerId === 'object' ? project?.ownerId?._id : project?.ownerId;
  const isOwner = currentUserId && String(ownerId) === String(currentUserId);
  const memberIds = project?.memberIds || [];
  const isMember = currentUserId && memberIds.some((m) => String(m) === String(currentUserId));
  const isAuthorized = isOwner || isMember;
  const memberCount = memberIds.length || 1;
  const isTeamFull = project ? memberCount >= project.teamSize : false;
  const isProjectOpen = project?.status === 'OPEN';

  const fetchProject = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data.project);
    } catch (err) {
      console.error('Failed to load project details:', err);
      setError(err.message || 'Project not found or unavailable.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchMyRequest = async () => {
    if (!id || !user) return;
    setIsLoadingMyRequest(true);
    try {
      const data = await collaborationService.getMyRequest(id);
      setMyRequest(data.request || null);
    } catch (err) {
      console.warn('Unable to load personal request:', err);
    } finally {
      setIsLoadingMyRequest(false);
    }
  };

  const fetchPendingCount = async () => {
    if (!id || !isOwner) return;
    try {
      const data = await collaborationService.getProjectRequests(id, { status: 'PENDING' });
      setPendingCount(data.pagination?.totalCount ?? data.results?.length ?? 0);
    } catch (err) {
      console.warn('Failed to load pending requests count:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject(true);
      socketService.joinProject(id);

      const handleRequestUpdated = (data) => {
        if (data && String(data.projectId) === String(id)) {
          if (data.senderId && String(data.senderId) === String(currentUserId)) {
            setMyRequest((prev) => (prev ? { ...prev, status: data.status } : data.request || null));
          }
          fetchProject(false);
          if (isOwner) fetchPendingCount();
        }
      };

      const handleRequestCreated = (data) => {
        if (data && String(data.projectId) === String(id)) {
          fetchProject(false);
          if (isOwner) fetchPendingCount();
        }
      };

      socketService.onRequestUpdated(handleRequestUpdated);
      socketService.onRequestCreated(handleRequestCreated);

      const handleProjectUpdated = (data) => {
        if (data && String(data.projectId) === String(id)) {
          setProject((prev) =>
            prev
              ? {
                  ...prev,
                  status: data.status,
                  memberIds: data.memberIds || prev.memberIds,
                }
              : prev
          );
          fetchProject(false);
        }
      };

      socketService.onProjectUpdated(handleProjectUpdated);

      const handleFocus = () => {
        fetchProject(false);
        if (user && !isOwner) fetchMyRequest();
        if (isOwner) fetchPendingCount();
      };
      window.addEventListener('focus', handleFocus);

      return () => {
        socketService.offRequestUpdated(handleRequestUpdated);
        socketService.offRequestCreated(handleRequestCreated);
        socketService.offProjectUpdated(handleProjectUpdated);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [id, currentUserId, isOwner]);

  useEffect(() => {
    if (id && user) {
      if (isOwner) {
        fetchPendingCount();
      } else {
        fetchMyRequest();
      }
    }
  }, [id, isOwner, user]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestError(null);
    setIsSubmittingRequest(true);

    try {
      const res = await collaborationService.createRequest(id, requestMessage.trim());
      setRequestSuccess(true);
      setRequestMessage('');
      setMyRequest(res.request);
      fetchProject(false);
    } catch (err) {
      console.error('Failed to submit collaboration request:', err);
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
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 'var(--space-xl)',
          }}>
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-3xl)',
              height: '420px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-2xl)',
              height: '320px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          </div>
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

  // Capacity calculations
  const capacityPercent = Math.min(100, Math.round((memberCount / project.teamSize) * 100));

  // Determine user role badge presentation
  const getRoleBadge = () => {
    if (isOwner) {
      return {
        label: 'Project Owner',
        caption: 'Full Admin & Roster Access',
        icon: <Crown size={15} color="#B84B00" />,
        bg: 'rgba(184, 75, 0, 0.08)',
        border: 'rgba(184, 75, 0, 0.22)',
        color: '#B84B00',
      };
    }
    if (isMember) {
      return {
        label: 'Team Member',
        caption: 'Collaborator & Sprint Access',
        icon: <UserCheck size={15} color="#059669" />,
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.22)',
        color: '#059669',
      };
    }
    return {
      label: 'Visitor / Applicant',
      caption: 'Public Project Preview',
      icon: <Sparkles size={15} color="#43577D" />,
      bg: 'rgba(67, 87, 125, 0.08)',
      border: 'rgba(67, 87, 125, 0.22)',
      color: '#43577D',
    };
  };

  const role = getRoleBadge();

  return (
    <div style={{
      paddingTop: 'var(--space-xl)',
      paddingBottom: 'var(--space-5xl)',
      minHeight: 'calc(100vh - 80px)',
    }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        {/* Top Header / Breadcrumb & Status */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
        }}>
          <Link
            to={ROUTES.PROJECTS}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          {/* Quick status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: project.status === 'OPEN' ? '#10B981' : project.status === 'IN_PROGRESS' ? '#3B82F6' : '#6C655F',
              backgroundColor: project.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : project.status === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(108, 101, 95, 0.1)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border-subtle)',
              letterSpacing: '0.04em',
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: project.status === 'OPEN' ? '#10B981' : project.status === 'IN_PROGRESS' ? '#3B82F6' : '#6C655F',
              }} />
              {project.status === 'OPEN' ? 'OPEN FOR COLLABORATION' : project.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
            </span>
          </div>
        </div>

        {/* Dynamic 2-Column Responsive Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: 'var(--space-xl)',
          alignItems: 'start',
        }}
        className="project-layout-container"
        >
          {/* LEFT COLUMN: Active Section View */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* ===================== SECTION 1: WORKSPACE ===================== */}
            {activeSection === 'workspace' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {/* Main Hero Card */}
                <div style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {/* Category & Difficulty pills */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-xs)',
                    marginBottom: 'var(--space-md)',
                  }}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                      <span style={badgeStyle}>
                        <Layers size={13} color="var(--color-accent)" />
                        {project.category}
                      </span>
                      <span style={badgeStyle}>
                        {project.difficulty}
                      </span>
                    </div>

                    {isOwner && project.status === 'COMPLETED' && (
                      <Link
                        to={`/showcases/create?projectId=${project._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.9rem', fontSize: 'var(--font-size-xs)', gap: '4px' }}
                      >
                        <Sparkles size={14} color="var(--color-accent)" />
                        Showcase Project
                      </Link>
                    )}
                  </div>

                  {/* Project Title */}
                  <h1 style={{
                    fontSize: 'clamp(1.85rem, 3.5vw, var(--font-size-3xl))',
                    fontWeight: 'var(--font-weight-extrabold)',
                    color: 'var(--color-text-main)',
                    letterSpacing: '-0.025em',
                    lineHeight: 'var(--line-height-snug)',
                    marginBottom: 'var(--space-md)',
                  }}>
                    {project.title}
                  </h1>

                  {/* Key Details Metrics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-md) var(--space-lg)',
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    marginBottom: 'var(--space-xl)',
                  }}>
                    <div>
                      <span style={metaLabelStyle}>Team Capacity</span>
                      <div style={metaValueStyle}>
                        <Users size={15} color="var(--color-accent)" />
                        {memberCount} / {project.teamSize} Members
                      </div>
                      <div style={{
                        marginTop: '6px',
                        height: '5px',
                        backgroundColor: 'var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${capacityPercent}%`,
                          backgroundColor: capacityPercent >= 100 ? '#3B82F6' : 'var(--color-accent)',
                          borderRadius: 'var(--radius-full)',
                        }} />
                      </div>
                    </div>

                    <div>
                      <span style={metaLabelStyle}>Target Deadline</span>
                      <div style={metaValueStyle}>
                        <Calendar size={15} color="var(--color-accent)" />
                        {formatDate(project.deadline)}
                      </div>
                    </div>

                    <div>
                      <span style={metaLabelStyle}>Created On</span>
                      <div style={metaValueStyle}>
                        {formatDate(project.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Repository Link (if present) */}
                  {project.repositoryUrl && (
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
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
                        <Code2 size={15} />
                        View Repository
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  {/* About the Project */}
                  <div>
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
                    <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border-subtle)' }}>
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
                            padding: '5px 12px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--color-border)',
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Roster Card */}
                <div style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-lg)',
                  }}>
                    <div>
                      <h3 style={{ ...sectionHeadingStyle, marginBottom: '2px' }}>
                        <Users size={18} color="var(--color-accent)" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Project Team Roster
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                        Active collaborators currently participating in this project ({memberCount} of {project.teamSize} seats occupied)
                      </p>
                    </div>

                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-bg-primary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--color-border-subtle)',
                    }}>
                      {project.teamSize - memberCount > 0 ? `${project.teamSize - memberCount} Open Seats` : 'Full Roster'}
                    </span>
                  </div>

                  <TeamMembers projectId={project._id} ownerId={ownerId} />
                </div>
              </div>
            )}

            {/* ===================== SECTION 2: TASKS ===================== */}
            {activeSection === 'tasks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {isAuthorized ? (
                  <div>
                    <div style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-lg) var(--space-xl)',
                      marginBottom: 'var(--space-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 'var(--space-md)',
                    }}>
                      <div>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-extrabold)', margin: 0 }}>
                          Project Tasks & Sprint Board
                        </h2>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                          Create, track, and assign sprint tasks for {project.title}.
                        </p>
                      </div>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                        <ShieldCheck size={14} />
                        Team Member Authorized
                      </span>
                    </div>

                    <TaskList projectId={project._id} isOwner={isOwner} />
                  </div>
                ) : (
                  /* Member Locked Preview State for Tasks */
                  <div style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4xl) var(--space-xl)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(184, 75, 0, 0.08)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-md)',
                    }}>
                      <CheckSquare size={32} />
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-xs)' }}>
                      Team Tasks & Sprint Management
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto var(--space-xl)' }}>
                      Sprint tasks, Kanban workflow boards (TODO, IN PROGRESS, COMPLETED), and task assignments are reserved for accepted project team members.
                    </p>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                      padding: 'var(--space-md) var(--space-xl)',
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: 'var(--space-xl)',
                    }}>
                      <Lock size={16} color="var(--color-text-muted)" />
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', fontWeight: 'var(--font-weight-medium)' }}>
                        Apply to this project to access and collaborate on live tasks.
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() => setActiveSection('requests')}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.6rem', gap: '8px' }}
                      >
                        <Send size={15} />
                        Go to Requests to Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== SECTION 3: MESSAGES ===================== */}
            {activeSection === 'messages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {isAuthorized ? (
                  <div>
                    <div style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-lg) var(--space-xl)',
                      marginBottom: 'var(--space-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 'var(--space-md)',
                    }}>
                      <div>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-extrabold)', margin: 0 }}>
                          Team Collaboration Channel
                        </h2>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                          Real-time team chat room for {project.title}.
                        </p>
                      </div>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                        <Radio size={14} className="pulse-dot" />
                        Live Socket Connected
                      </span>
                    </div>

                    <MessageList projectId={project._id} />
                  </div>
                ) : (
                  /* Member Locked Preview State for Messages */
                  <div style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4xl) var(--space-xl)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(67, 87, 125, 0.08)',
                      color: 'var(--color-primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-md)',
                    }}>
                      <MessageSquare size={32} />
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-xs)' }}>
                      Private Team Chat Channel
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto var(--space-xl)' }}>
                      Real-time group messaging and team discussion rooms are restricted to accepted project team members.
                    </p>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                      padding: 'var(--space-md) var(--space-xl)',
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: 'var(--space-xl)',
                    }}>
                      <Lock size={16} color="var(--color-text-muted)" />
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', fontWeight: 'var(--font-weight-medium)' }}>
                        Join this team to participate in live discussions and team updates.
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() => setActiveSection('requests')}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.6rem', gap: '8px' }}
                      >
                        <Send size={15} />
                        Go to Requests to Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== SECTION 4: REQUESTS (SEND & ACCEPT) ===================== */}
            {activeSection === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {/* Section Header */}
                <div style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-lg) var(--space-xl)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
                }}>
                  <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-extrabold)', margin: 0 }}>
                      Collaboration Requests & Applications
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                      {isOwner
                        ? 'Manage, review, and accept incoming student applications to join your team.'
                        : 'Submit and track your collaboration request to join this project team.'}
                    </p>
                  </div>

                  {/* Role indicator */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: role.color,
                    backgroundColor: role.bg,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${role.border}`,
                  }}>
                    {role.icon}
                    {isOwner ? 'Reviewer Mode (Receiver)' : 'Applicant Mode (Sender)'}
                  </span>
                </div>

                {/* --- RECEIVER UI (OWNER) --- */}
                {isOwner && (
                  <div style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 'var(--space-sm)',
                      marginBottom: 'var(--space-lg)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      paddingBottom: 'var(--space-md)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Inbox size={20} color="var(--color-accent)" />
                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                          Incoming Applications ({pendingCount} Pending)
                        </h3>
                      </div>

                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        Capacity: {memberCount} / {project.teamSize} Filled
                      </div>
                    </div>

                    <ProjectRequestsList
                      projectId={project._id}
                      onRequestDecided={() => {
                        fetchProject(false);
                        fetchPendingCount();
                      }}
                    />
                  </div>
                )}

                {/* --- SENDER UI (APPLICANT / VISITOR / MEMBER) --- */}
                {!isOwner && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {/* If user is already an accepted member */}
                    {isMember ? (
                      <div style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-3xl) var(--space-xl)',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-sm)',
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--space-md)',
                        }}>
                          <CheckCircle2 size={30} />
                        </div>
                        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-extrabold)', color: '#065F46', marginBottom: 'var(--space-xs)' }}>
                          You are an Active Team Member!
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto var(--space-xl)' }}>
                          Your application was accepted by the project owner. You now have full access to view and create tasks, and chat in real-time with the team.
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setActiveSection('tasks')}
                            className="btn btn-primary"
                            style={{ padding: '0.6rem 1.4rem', gap: '6px' }}
                          >
                            <CheckSquare size={15} />
                            Go to Tasks Board
                          </button>
                          <button
                            onClick={() => setActiveSection('messages')}
                            className="btn btn-secondary"
                            style={{ padding: '0.6rem 1.4rem', gap: '6px' }}
                          >
                            <MessageSquare size={15} />
                            Open Team Chat
                          </button>
                        </div>
                      </div>
                    ) : myRequest ? (
                      /* Existing Sent Request Status View */
                      <div style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
                        boxShadow: 'var(--shadow-sm)',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 'var(--space-sm)',
                          marginBottom: 'var(--space-lg)',
                          borderBottom: '1px solid var(--color-border-subtle)',
                          paddingBottom: 'var(--space-md)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Send size={18} color="var(--color-accent)" />
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                              Your Sent Application
                            </h3>
                          </div>

                          {/* Status Badge */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-extrabold)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            letterSpacing: '0.04em',
                            backgroundColor:
                              myRequest.status === 'PENDING'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : myRequest.status === 'ACCEPTED'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            color:
                              myRequest.status === 'PENDING'
                                ? '#D97706'
                                : myRequest.status === 'ACCEPTED'
                                ? '#059669'
                                : '#DC2626',
                            border:
                              myRequest.status === 'PENDING'
                                ? '1px solid rgba(245, 158, 11, 0.3)'
                                : myRequest.status === 'ACCEPTED'
                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                : '1px solid rgba(239, 68, 68, 0.3)',
                          }}>
                            {myRequest.status === 'PENDING' ? (
                              <>
                                <Clock size={13} />
                                UNDER REVIEW BY OWNER
                              </>
                            ) : myRequest.status === 'ACCEPTED' ? (
                              <>
                                <CheckCircle2 size={13} />
                                APPLICATION ACCEPTED
                              </>
                            ) : (
                              <>
                                <AlertCircle size={13} />
                                APPLICATION DECLINED
                              </>
                            )}
                          </span>
                        </div>

                        {myRequest.status === 'PENDING' && (
                          <div style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-lg)',
                            marginBottom: 'var(--space-lg)',
                          }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: '#B45309', marginBottom: '4px' }}>
                              Application Pending Owner Review
                            </div>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                              Your pitch has been received by the project owner. Live real-time socket events will automatically notify you here when the decision is made.
                            </p>
                          </div>
                        )}

                        {myRequest.status === 'REJECTED' && (
                          <div style={{
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-lg)',
                            marginBottom: 'var(--space-lg)',
                          }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: '#991B1B', marginBottom: '4px' }}>
                              Request Not Accepted
                            </div>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                              The owner was unable to accept this request. You may explore other open projects on the discovery feed.
                            </p>
                          </div>
                        )}

                        {/* Submitted Message */}
                        <div style={{
                          backgroundColor: 'var(--color-bg-primary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border-subtle)',
                          padding: 'var(--space-md) var(--space-lg)',
                          marginBottom: 'var(--space-md)',
                        }}>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                            Your Submitted Pitch / Message:
                          </div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                            "{myRequest.message || 'No additional message attached'}"
                          </div>
                        </div>

                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Sent on {formatDate(myRequest.createdAt)}
                        </div>
                      </div>
                    ) : (
                      /* Send Request Form */
                      <div style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'clamp(var(--space-xl), 3vw, var(--space-2xl))',
                        boxShadow: 'var(--shadow-sm)',
                      }}>
                        {!isProjectOpen ? (
                          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>
                            <Clock size={32} style={{ margin: '0 auto var(--space-sm)', color: 'var(--color-text-subtle)' }} />
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                              Collaboration Closed
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                              This project status is {project.status} and is currently not accepting new collaboration requests.
                            </p>
                          </div>
                        ) : isTeamFull ? (
                          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>
                            <Users size={32} style={{ margin: '0 auto var(--space-sm)', color: 'var(--color-text-subtle)' }} />
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                              Team at Full Capacity
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                              This project has reached its maximum quota of {project.teamSize} members.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleSendRequest}>
                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                              <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: 'var(--font-weight-extrabold)',
                                color: 'var(--color-text-main)',
                                marginBottom: 'var(--space-xs)',
                              }}>
                                Send Collaboration Request
                              </h3>
                              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                                Introduce your technical background, skills, and why you are excited to collaborate on this project.
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
                                Pitch / Message <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>(Optional but recommended)</span>
                              </label>
                              <textarea
                                id="requestMessage"
                                rows={4}
                                maxLength={1000}
                                placeholder="Describe your relevant skills, portfolio links, or motivation for joining this sprint..."
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
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                  {requestMessage.length}/1000 characters
                                </span>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmittingRequest}
                              className="btn btn-primary"
                              style={{ padding: '0.65rem 1.6rem', minWidth: '180px', justifyContent: 'center' }}
                            >
                              {isSubmittingRequest ? (
                                <>
                                  <Loader2 size={16} className="spin-icon" />
                                  Sending Application...
                                </>
                              ) : (
                                <>
                                  <Send size={15} />
                                  Submit Collaboration Application
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Dynamic Floating Nav Bar */}
          <div style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
          className="project-floating-nav-column"
          >
            {/* User Role Card */}
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: `1px solid ${role.border}`,
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-md) var(--space-lg)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: role.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {role.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-extrabold)', color: role.color }}>
                  {role.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {role.caption}
                </div>
              </div>
            </div>

            {/* Dynamic Navigation Dock */}
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-sm)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {/* Nav 1: Workspace */}
              <button
                onClick={() => setActiveSection('workspace')}
                style={{
                  ...navButtonStyle,
                  backgroundColor: activeSection === 'workspace' ? 'var(--color-accent-soft)' : 'transparent',
                  borderColor: activeSection === 'workspace' ? 'var(--color-accent-border)' : 'transparent',
                  color: activeSection === 'workspace' ? 'var(--color-accent)' : 'var(--color-text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeSection === 'workspace' ? 'rgba(184, 75, 0, 0.15)' : 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeSection === 'workspace' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    <LayoutDashboard size={17} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: activeSection === 'workspace' ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)' }}>
                      Workspace
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Details & Team Roster
                    </div>
                  </div>
                </div>

                <span style={pillBadgeStyle}>
                  {memberCount}/{project.teamSize}
                </span>
              </button>

              {/* Nav 2: Tasks */}
              <button
                onClick={() => setActiveSection('tasks')}
                style={{
                  ...navButtonStyle,
                  backgroundColor: activeSection === 'tasks' ? 'var(--color-accent-soft)' : 'transparent',
                  borderColor: activeSection === 'tasks' ? 'var(--color-accent-border)' : 'transparent',
                  color: activeSection === 'tasks' ? 'var(--color-accent)' : 'var(--color-text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeSection === 'tasks' ? 'rgba(184, 75, 0, 0.15)' : 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeSection === 'tasks' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    <CheckSquare size={17} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: activeSection === 'tasks' ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)' }}>
                      Tasks
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Sprint & Kanban
                    </div>
                  </div>
                </div>

                {isAuthorized ? (
                  <span style={{ ...pillBadgeStyle, color: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    Active
                  </span>
                ) : (
                  <span style={{ ...pillBadgeStyle, color: 'var(--color-text-subtle)' }}>
                    <Lock size={11} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                    Team
                  </span>
                )}
              </button>

              {/* Nav 3: Messages */}
              <button
                onClick={() => setActiveSection('messages')}
                style={{
                  ...navButtonStyle,
                  backgroundColor: activeSection === 'messages' ? 'var(--color-accent-soft)' : 'transparent',
                  borderColor: activeSection === 'messages' ? 'var(--color-accent-border)' : 'transparent',
                  color: activeSection === 'messages' ? 'var(--color-accent)' : 'var(--color-text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeSection === 'messages' ? 'rgba(184, 75, 0, 0.15)' : 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeSection === 'messages' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    <MessageSquare size={17} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: activeSection === 'messages' ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)' }}>
                      Messages
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Real-time Chat
                    </div>
                  </div>
                </div>

                {isAuthorized ? (
                  <span style={{ ...pillBadgeStyle, color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    Live
                  </span>
                ) : (
                  <span style={{ ...pillBadgeStyle, color: 'var(--color-text-subtle)' }}>
                    <Lock size={11} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                    Team
                  </span>
                )}
              </button>

              {/* Nav 4: Requests (Send / Accept based on user) */}
              <button
                onClick={() => setActiveSection('requests')}
                style={{
                  ...navButtonStyle,
                  backgroundColor: activeSection === 'requests' ? 'var(--color-accent-soft)' : 'transparent',
                  borderColor: activeSection === 'requests' ? 'var(--color-accent-border)' : 'transparent',
                  color: activeSection === 'requests' ? 'var(--color-accent)' : 'var(--color-text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeSection === 'requests' ? 'rgba(184, 75, 0, 0.15)' : 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeSection === 'requests' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    {isOwner ? <Inbox size={17} /> : <Send size={17} />}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: activeSection === 'requests' ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)' }}>
                      Requests
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {isOwner ? 'Review & Accept' : (myRequest ? 'Application Status' : 'Send Pitch')}
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  pendingCount > 0 ? (
                    <span style={{
                      ...pillBadgeStyle,
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: 'var(--font-weight-extrabold)',
                    }}>
                      {pendingCount}
                    </span>
                  ) : (
                    <span style={pillBadgeStyle}>
                      0
                    </span>
                  )
                ) : myRequest ? (
                  <span style={{
                    ...pillBadgeStyle,
                    color: myRequest.status === 'PENDING' ? '#D97706' : myRequest.status === 'ACCEPTED' ? '#059669' : '#DC2626',
                    backgroundColor: myRequest.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : myRequest.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  }}>
                    {myRequest.status}
                  </span>
                ) : (
                  <span style={{ ...pillBadgeStyle, color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-soft)' }}>
                    Apply
                  </span>
                )}
              </button>
            </div>

            {/* Quick Summary Card in Floating Bar */}
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-md) var(--space-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Info
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--font-size-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Category</span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>{project.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Difficulty</span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>{project.difficulty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Deadline</span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>{formatDate(project.deadline)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

const navButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.18s ease',
  backgroundColor: 'transparent',
};

const pillBadgeStyle = {
  fontSize: '11px',
  fontWeight: 'var(--font-weight-bold)',
  padding: '2px 8px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--color-text-muted)',
  border: '1px solid var(--color-border-subtle)',
};
