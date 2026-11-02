import React from 'react';
import { Bot, User, Clock, CheckCheck } from 'lucide-react';
import '../../styles/global.css';

export const MessageBubble = ({ message, currentUserId, teamMembers = [] }) => {
  const isOwnMessage = String(message.senderId) === String(currentUserId);
  
  // Find sender in team members
  const sender = teamMembers.find((m) => String(m._id) === String(message.senderId));
  const senderName = sender ? sender.name : isOwnMessage ? 'You' : 'Teammate';
  
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
      marginBottom: 'var(--space-md)',
      width: '100%',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Sender Identifier */}
      {!isOwnMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '5px',
          paddingLeft: '6px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: 'var(--radius-xs)',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: 'var(--color-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {getInitials(senderName)}
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            {senderName}
          </span>
        </div>
      )}

      {/* Cyber Bubble */}
      <div style={{
        maxWidth: '78%',
        padding: '12px 16px',
        borderRadius: isOwnMessage
          ? 'var(--radius-md) var(--radius-md) 2px var(--radius-md)'
          : 'var(--radius-md) var(--radius-md) var(--radius-md) 2px',
        background: isOwnMessage 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)' 
          : 'rgba(22, 29, 45, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#FFFFFF',
        border: isOwnMessage 
          ? '1px solid rgba(99, 102, 241, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isOwnMessage 
          ? '0 4px 20px rgba(99, 102, 241, 0.2), inset 0 0 12px rgba(99, 102, 241, 0.1)' 
          : '0 4px 15px rgba(0, 0, 0, 0.3)',
        wordBreak: 'break-word',
        position: 'relative',
      }}>
        {/* Subtle Cyber Corner Indicator */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: isOwnMessage ? 'auto' : 0,
          left: isOwnMessage ? 0 : 'auto',
          width: '6px',
          height: '6px',
          backgroundColor: isOwnMessage ? 'var(--color-cyan)' : 'var(--color-accent)',
          borderRadius: isOwnMessage ? 'var(--radius-md) 0 0 0' : '0 var(--radius-md) 0 0',
          opacity: 0.8,
        }} />

        <p style={{
          fontSize: 'var(--font-size-sm)',
          lineHeight: 1.55,
          color: '#f8fafc',
          margin: 0,
        }}>
          {message.message}
        </p>

        {/* Time Stamp & Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '4px',
          marginTop: '6px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: isOwnMessage ? 'rgba(255, 255, 255, 0.6)' : 'var(--color-text-subtle)',
        }}>
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && <CheckCheck size={13} color="var(--color-cyan)" />}
        </div>
      </div>
    </div>
  );
};
