import React, { useState, useEffect } from 'react';
import { collaborationService } from '../../services/collaboration.service';
import { socketService } from '../../services/socket.service';
import { Check, X, Clock, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import '../../styles/global.css';

export const ProjectRequestsList = ({ projectId, onRequestDecided }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decidingId, setDecidingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await collaborationService.getProjectRequests(projectId, { status: 'PENDING' });
      setRequests(data.results || []);
    } catch (err) {
      console.error('Failed to load project requests:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRequests();

      socketService.joinProject(projectId);

      const handleReqChange = () => {
        fetchRequests();
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
        message: status === 'ACCEPTED' ? 'Collaboration request accepted!' : 'Collaboration request rejected.',
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        padding: 'var(--space-lg)',
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
        return (
          <div
            key={reqItem._id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md) var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-sm)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
              }}>
                <Clock size={13} />
                <span>Submitted {formatDate(reqItem.createdAt)}</span>
              </div>

              <span style={{
                fontSize: '10px',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-warning)',
                backgroundColor: 'var(--color-warning-bg)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
              }}>
                PENDING REVIEW
              </span>
            </div>

            {reqItem.message ? (
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-main)',
                backgroundColor: 'var(--color-bg-primary)',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-xs)',
                lineHeight: 'var(--line-height-normal)',
              }}>
                <MessageSquare size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>"{reqItem.message}"</span>
              </div>
            ) : (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', italic: true }}>
                No pitch message attached.
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-sm)',
              marginTop: 'var(--space-xs)',
              paddingTop: 'var(--space-xs)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}>
              <button
                onClick={() => handleDecision(reqItem._id, 'REJECTED')}
                disabled={isProcessing}
                className="btn btn-outline"
                style={{
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: '#B91C1C',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
              >
                {isProcessing ? <Loader2 size={12} className="spin-icon" /> : <X size={12} />}
                Reject
              </button>

              <button
                onClick={() => handleDecision(reqItem._id, 'ACCEPTED')}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{
                  padding: '4px 12px',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                {isProcessing ? <Loader2 size={12} className="spin-icon" /> : <Check size={12} />}
                Accept Member
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
