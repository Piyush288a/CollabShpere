import React, { useState } from 'react';
import { Calendar, User, Trash2, ArrowRight, CheckCircle2, Clock, Loader2, Sparkles, AlertCircle, Terminal } from 'lucide-react';
import '../../styles/global.css';

export const TaskCard = ({ task, teamMembers = [], onUpdateStatus, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find assignee details
  const assignee = task.assignedTo
    ? teamMembers.find((m) => String(m._id) === String(task.assignedTo))
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStatusChange = async (nextStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(task._id, nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Terminate directive "${task.title}" permanently?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Styling with Cyber Neon Colors
  const getStatusBadge = () => {
    switch (task.status) {
      case 'TODO':
        return (
          <span className="badge badge-amber">
            <Clock size={11} /> QUEUED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-cyan">
            <Loader2 size={11} className="spin" /> RUNNING
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-emerald">
            <CheckCircle2 size={11} /> EXECUTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(22, 29, 45, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-md)',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      transition: 'all var(--transition-normal)',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }}
    >
      {/* Top Border Accent Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: task.status === 'COMPLETED' 
          ? 'var(--color-emerald)' 
          : task.status === 'IN_PROGRESS' 
          ? 'var(--gradient-cyber)' 
          : 'rgba(245, 158, 11, 0.8)',
      }} />

      {/* Main Content */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-sm)',
          marginBottom: '8px',
        }}>
          <h4 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: '#FFFFFF',
            lineHeight: 1.35,
          }}>
            {task.title}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getStatusBadge()}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Directive"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-subtle)',
                cursor: 'pointer',
                padding: '3px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f87171';
                e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-subtle)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isDeleting ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        </div>

        {task.description && (
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            marginBottom: 'var(--space-md)',
          }}>
            {task.description}
          </p>
        )}

        {/* Metadata Node: Assignee & Due Date */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-md)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-subtle)',
          paddingTop: '6px',
        }}>
          {/* Assignee Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={12} color="var(--color-cyan)" />
            <span style={{ color: assignee ? '#FFFFFF' : 'var(--color-text-subtle)' }}>
              {assignee ? assignee.name : 'UNASSIGNED'}
            </span>
          </div>

          {/* Due Date Tag */}
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={12} color="var(--color-amber)" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Trigger Buttons for forward state machine */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 'var(--space-sm)',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        {task.status === 'TODO' && (
          <button
            onClick={() => handleStatusChange('IN_PROGRESS')}
            disabled={isUpdating}
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              color: 'var(--color-cyan)',
            }}
          >
            {isUpdating ? <Loader2 size={12} className="spin" /> : <ArrowRight size={12} />}
            INITIALIZE PHASE
          </button>
        )}

        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={() => handleStatusChange('COMPLETED')}
            disabled={isUpdating}
            className="btn btn-primary"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            {isUpdating ? <Loader2 size={12} className="spin" /> : <CheckCircle2 size={12} />}
            MARK EXECUTED
          </button>
        )}

        {task.status === 'COMPLETED' && (
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <CheckCircle2 size={12} /> PROTOCOL_FINALIZED
          </span>
        )}
      </div>
    </div>
  );
};
