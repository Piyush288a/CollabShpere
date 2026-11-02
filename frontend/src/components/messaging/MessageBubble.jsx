import React from 'react';
import '../../styles/global.css';

export const MessageBubble = ({ message, currentUserId, teamMembers = [] }) => {
  const isOwnMessage = String(message.senderId) === String(currentUserId);
  
  // Find sender in team members
  const sender = teamMembers.find((m) => String(m._id) === String(message.senderId));
  const senderName = sender ? sender.name : isOwnMessage ? 'You' : 'Team Member';
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
      marginBottom: 'var(--space-md)',
      width: '100%',
    }}>
      {/* Sender Name (for other members) */}
      {!isOwnMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '4px',
          paddingLeft: '4px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-dark)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {getInitials(senderName)}
          </div>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
          }}>
            {senderName}
          </span>
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: isOwnMessage
          ? 'var(--radius-lg) var(--radius-lg) 2px var(--radius-lg)'
          : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px',
        backgroundColor: isOwnMessage ? 'var(--color-accent)' : 'var(--color-bg-surface)',
        color: isOwnMessage ? '#FFFFFF' : 'var(--color-text-main)',
        border: isOwnMessage ? 'none' : '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-xs)',
        wordBreak: 'break-word',
      }}>
        <p style={{
          margin: 0,
          fontSize: 'var(--font-size-sm)',
          lineHeight: 'var(--line-height-normal)',
          whiteSpace: 'pre-wrap',
        }}>
          {message.message}
        </p>

        <div style={{
          textAlign: 'right',
          marginTop: '4px',
          fontSize: '10px',
          opacity: 0.8,
          color: isOwnMessage ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-text-subtle)',
        }}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};
