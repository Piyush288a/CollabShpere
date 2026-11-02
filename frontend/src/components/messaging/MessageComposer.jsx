import React, { useState } from 'react';
import { Send, Sparkles, Terminal } from 'lucide-react';
import '../../styles/global.css';

export const MessageComposer = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onSendMessage(trimmed);
      setText('');
    } catch (err) {
      console.error('Failed to dispatch message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '12px 16px',
        backgroundColor: 'rgba(10, 13, 20, 0.9)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute',
          left: '14px',
          color: 'var(--color-cyan)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: 0.8,
        }}>
          <Terminal size={16} />
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Workspace communication disabled...' : 'Transmit quantum packet to team room... (Enter to send)'}
          disabled={disabled || isSubmitting}
          maxLength={2000}
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            backgroundColor: 'rgba(22, 29, 45, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            color: '#FFFFFF',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
            transition: 'all var(--transition-fast)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-cyan)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.4)';
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isSubmitting || disabled}
        className="btn btn-primary"
        style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          opacity: !text.trim() || isSubmitting || disabled ? 0.4 : 1,
          cursor: !text.trim() || isSubmitting || disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <Send size={16} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>TRANSMIT</span>
      </button>
    </form>
  );
};
