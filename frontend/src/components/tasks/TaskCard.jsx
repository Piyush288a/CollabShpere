import React, { useState } from 'react';
import { Calendar, User, Trash2, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
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
    if (!window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (task.status) {
      case 'TODO':
        return (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: '#D97706',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Clock size={12} /> TODO
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Loader2 size={12} className="spin" /> IN PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: '#166534',
            backgroundColor: '#F0FDF4',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <CheckCircle2 size={12} /> COMPLETED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card" style={{
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-lg)',
      transition: 'box-shadow var(--transition-fast)',
    }}>
      {/* Top Header: Title & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <div>
          <h3 style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            margin: 0,
            lineHeight: 'var(--line-height-tight)',
          }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-xs)',
              marginBottom: 0,
              lineHeight: 'var(--line-height-normal)',
            }}>
              {task.description}
            </p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Meta Row: Assignee & Due Date */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        paddingTop: 'var(--space-xs)',
        borderTop: '1px solid var(--color-border-subtle)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {/* Assignee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={13} color="var(--color-text-subtle)" />
            <span>
              {assignee ? (
                <strong style={{ color: 'var(--color-text-main)' }}>{assignee.name}</strong>
              ) : (
                <span style={{ fontStyle: 'italic', color: 'var(--color-text-subtle)' }}>Unassigned</span>
              )}
            </span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={13} color="var(--color-text-subtle)" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Actions Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          {/* Forward-only status transition buttons */}
          {task.status === 'TODO' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={isUpdating || isDeleting}
              className="btn btn-secondary"
              style={{
                padding: '4px 10px',
                fontSize: 'var(--font-size-xs)',
                gap: '4px',
                color: '#2563EB',
                borderColor: 'rgba(37, 99, 235, 0.3)',
              }}
            >
              {isUpdating ? <Loader2 size={13} className="spin" /> : <>Start Task <ArrowRight size={13} /></>}
            </button>
          )}

          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={isUpdating || isDeleting}
              className="btn btn-primary"
              style={{
                padding: '4px 10px',
                fontSize: 'var(--font-size-xs)',
                gap: '4px',
                backgroundColor: '#166534',
                borderColor: '#166534',
              }}
            >
              {isUpdating ? <Loader2 size={13} className="spin" /> : <>Complete <CheckCircle2 size={13} /></>}
            </button>
          )}

          {/* Delete Action */}
          <button
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            title="Delete task"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-subtle)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-subtle)')}
          >
            {isDeleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
