import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collaborationService } from '../../services/collaboration.service';
import { showcaseService } from '../../services/showcase.service';
import { socketService } from '../../services/socket.service';
import {
  Check,
  X,
  Clock,
  MessageSquare,
  Loader2,
  AlertCircle,
  User,
  Mail,
  ExternalLink,
  Sparkles,
  Github,
  Linkedin,
  ThumbsUp,
  FolderGit2,
  Code2,
} from 'lucide-react';
import '../../styles/global.css';

export const ProjectRequestsList = ({ projectId, onRequestDecided }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decidingId, setDecidingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Sender Profile & Showcase Modal State
  const [selectedSender, setSelectedSender] = useState(null);
  const [senderShowcases, setSenderShowcases] = useState([]);
  const [isLoadingShowcases, setIsLoadingShowcases] = useState(false);

  const fetchRequests = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await collaborationService.getProjectRequests(projectId, { status: 'PENDING' });
      setRequests(data.results || []);
    } catch (err) {
      console.error('Failed to load project requests:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRequests(true);

      socketService.joinProject(projectId);

      const handleReqChange = () => {
        fetchRequests(false);
      };

      socketService.onRequestCreated(handleReqChange);
      socketService.onRequestUpdated(handleReqChange);

      return () => {
        socketService.offRequestCreated(handleReqChange);
        socketService.offRequestUpdated(handleReqChange);
      };
    }
  }, [projectId]);

  const handleDecision = async (requestId, status) => {
    setDecidingId(requestId);
    setActionFeedback(null);
    try {
      await collaborationService.decideRequest(requestId, status);
      setActionFeedback({
        type: 'success',
        message: status === 'ACCEPTED' ? 'Collaboration request accepted! Member added to team.' : 'Collaboration request rejected.',
      });

      // Remove decided request from pending list
      setRequests((prev) => prev.filter((r) => r._id !== requestId));

      // Trigger parent callback to refresh project details & team roster
      if (onRequestDecided) {
        onRequestDecided();
      }
    } catch (err) {
      console.error('Failed to decide request:', err);
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update request',
      });
    } finally {
      setDecidingId(null);
    }
  };

  const openSenderProfile = async (sender) => {
    if (!sender) return;
    setSelectedSender(sender);
    setIsLoadingShowcases(true);
    setSenderShowcases([]);
    try {
      const data = await showcaseService.getShowcases({ userId: sender._id, limit: 10 });
      setSenderShowcases(data.results || []);
    } catch (err) {
      console.warn('Failed to fetch showcases for sender:', err);
    } finally {
      setIsLoadingShowcases(false);
    }
  };

  const closeSenderProfile = () => {
    setSelectedSender(null);
    setSenderShowcases([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div style={{
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
      }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Loading pending requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: '#B91C1C',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-sm)',
      }}>
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px dashed var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        textAlign: 'center',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-muted)',
      }}>
        No pending collaboration requests at this time.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {actionFeedback && (
        <div style={{
          fontSize: 'var(--font-size-xs)',
          padding: 'var(--space-xs) var(--space-md)',
          borderRadius: 'var(--radius-xs)',
          color: actionFeedback.type === 'success' ? '#047857' : '#B91C1C',
          backgroundColor: actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
        }}>
          {actionFeedback.message}
        </div>
      )}

      {requests.map((reqItem) => {
        const isProcessing = decidingId === reqItem._id;
        const sender = reqItem.sender;
        const senderName = sender?.name || 'Applicant';
        const senderEmail = sender?.email || '';
        const senderSkills = sender?.skills || [];
        const senderBio = sender?.bio || '';

        return (
          <div
            key={reqItem._id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Top Row: Sender Info & Status Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}>
              {/* Sender Identity Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {sender?.avatar ? (
                  <img
                    src={sender.avatar}
                    alt={senderName}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-full)',
                      objectFit: 'cover',
                      border: '2px solid var(--color-border)',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(184, 75, 0, 0.12)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--font-weight-extrabold)',
                    fontSize: 'var(--font-size-sm)',
                    border: '1px solid rgba(184, 75, 0, 0.25)',
                    flexShrink: 0,
                  }}>
                    {getInitials(senderName)}
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>
                      {senderName}
                    </span>
                    {sender?.role && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-accent)',
                        backgroundColor: 'var(--color-accent-soft)',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-xs)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}>
                        {sender.role}
                      </span>
                    )}
                  </div>

                  {senderEmail && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-muted)',
                      marginTop: '2px',
                    }}>
                      <Mail size={12} />
                      <span>{senderEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pill & Submission Date */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#D97706',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  letterSpacing: '0.04em',
                }}>
                  PENDING REVIEW
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}>
                  <Clock size={12} />
                  <span>{formatDate(reqItem.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Sender Bio Preview (if available) */}
            {senderBio && (
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                lineHeight: 'var(--line-height-normal)',
                backgroundColor: 'var(--color-bg-primary)',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-xs)',
                borderLeft: '3px solid var(--color-border)',
              }}>
                "{senderBio}"
              </div>
            )}

            {/* Sender Skills Tags */}
            {senderSkills.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                  Skills:
                </span>
                {senderSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-main)',
                      backgroundColor: 'var(--color-bg-primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            )}

            {/* Pitch Message Box */}
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-main)',
              backgroundColor: 'var(--color-bg-primary)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pitch Message:
              </div>
              <div style={{ fontStyle: reqItem.message ? 'normal' : 'italic', color: reqItem.message ? 'var(--color-text-main)' : 'var(--color-text-subtle)' }}>
                {reqItem.message ? `"${reqItem.message}"` : 'No pitch message attached with request.'}
              </div>
            </div>

            {/* Bottom Actions: View Profile / Showcases & Decision Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-sm)',
              paddingTop: 'var(--space-xs)',
              borderTop: '1px solid var(--color-border-subtle)',
              flexWrap: 'wrap',
            }}>
              {/* Option to view profile & showcases */}
              <button
                type="button"
                onClick={() => openSenderProfile(sender || { _id: reqItem.senderId, name: senderName, email: senderEmail })}
                className="btn btn-secondary"
                style={{
                  padding: '5px 12px',
                  fontSize: 'var(--font-size-xs)',
                  gap: '6px',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                <Sparkles size={13} color="var(--color-accent)" />
                View Profile & Showcases
              </button>

              {/* Accept & Reject Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <button
                  onClick={() => handleDecision(reqItem._id, 'REJECTED')}
                  disabled={isProcessing}
                  className="btn btn-outline"
                  style={{
                    padding: '5px 12px',
                    fontSize: 'var(--font-size-xs)',
                    color: '#B91C1C',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    gap: '4px',
                  }}
                >
                  {isProcessing ? <Loader2 size={13} className="spin-icon" /> : <X size={13} />}
                  Decline
                </button>

                <button
                  onClick={() => handleDecision(reqItem._id, 'ACCEPTED')}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{
                    padding: '5px 14px',
                    fontSize: 'var(--font-size-xs)',
                    gap: '4px',
                  }}
                >
                  {isProcessing ? <Loader2 size={13} className="spin-icon" /> : <Check size={13} />}
                  Accept Member
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* ================= SENDER PROFILE & SHOWCASE MODAL ================= */}
      {selectedSender && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-lg)',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: 'var(--space-md)',
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-extrabold)', margin: 0 }}>
                  Applicant Profile & Showcases
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                  Review this student's background, technical skills, and published project showcases.
                </p>
              </div>

              <button
                onClick={closeSenderProfile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                {selectedSender.avatar ? (
                  <img
                    src={selectedSender.avatar}
                    alt={selectedSender.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-full)',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(184, 75, 0, 0.15)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--font-weight-extrabold)',
                    fontSize: 'var(--font-size-lg)',
                    border: '1px solid rgba(184, 75, 0, 0.25)',
                  }}>
                    {getInitials(selectedSender.name)}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>
                    {selectedSender.name}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    {selectedSender.email}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent-soft)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    textTransform: 'uppercase',
                  }}>
                    {selectedSender.role || 'Student'}
                  </span>
                </div>
              </div>

              {selectedSender.bio && (
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', marginBottom: 'var(--space-md)', lineHeight: 'var(--line-height-relaxed)' }}>
                  {selectedSender.bio}
                </div>
              )}

              {/* Skills */}
              {selectedSender.skills && selectedSender.skills.length > 0 && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Technical Skills:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedSender.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '11px',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-main)',
                          backgroundColor: 'var(--color-bg-surface)',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {selectedSender.githubUrl && (
                  <a
                    href={selectedSender.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '6px' }}
                  >
                    <Github size={13} />
                    GitHub Profile
                    <ExternalLink size={11} />
                  </a>
                )}
                {selectedSender.linkedinUrl && (
                  <a
                    href={selectedSender.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '6px' }}
                  >
                    <Linkedin size={13} />
                    LinkedIn Profile
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Showcases Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="var(--color-accent)" />
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                    Published Project Showcases
                  </h4>
                </div>

                <Link
                  to="/showcases"
                  target="_blank"
                  style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  All Showcases
                  <ExternalLink size={11} />
                </Link>
              </div>

              {isLoadingShowcases ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                  <Loader2 size={24} className="spin-icon" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 'var(--font-size-xs)' }}>Loading student showcases...</div>
                </div>
              ) : senderShowcases.length === 0 ? (
                <div style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)',
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                }}>
                  <FolderGit2 size={28} style={{ margin: '0 auto 6px', color: 'var(--color-text-subtle)' }} />
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '2px' }}>
                    No project showcases published yet
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)' }}>
                    This student hasn't published a project showcase to the showcase feed.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {senderShowcases.map((sc) => (
                    <div
                      key={sc._id}
                      style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-xs)' }}>
                        <Link
                          to={`/showcases/${sc._id}`}
                          target="_blank"
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-main)',
                            textDecoration: 'none',
                          }}
                        >
                          {sc.title}
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          <ThumbsUp size={12} />
                          <span>{sc.likesCount || 0}</span>
                        </div>
                      </div>

                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {sc.description}
                      </div>

                      {sc.technologies && sc.technologies.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                          {sc.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '10px',
                                color: 'var(--color-text-muted)',
                                backgroundColor: 'var(--color-bg-surface)',
                                border: '1px solid var(--color-border-subtle)',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-xs)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <Link
                          to={`/showcases/${sc._id}`}
                          target="_blank"
                          className="btn btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px', gap: '4px' }}
                        >
                          Open Showcase
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xl)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-md)' }}>
              <button
                type="button"
                onClick={closeSenderProfile}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1.2rem', fontSize: 'var(--font-size-xs)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
