import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import '../../styles/global.css';

export const MessageComposer = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(trimmed);
      setText(''); // Clear only on successful send
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={handleSend}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
      }}
    >
      <input
        type="text"
        className="input"
        placeholder="Type a message to your team... (Press Enter to send)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSending}
        maxLength={2000}
        style={{
          flex: 1,
          backgroundColor: 'var(--color-bg-primary)',
          fontSize: 'var(--font-size-sm)',
        }}
      />

      <button
        type="submit"
        disabled={!text.trim() || disabled || isSending}
        className="btn btn-primary"
        style={{
          padding: '0.6rem 1rem',
          fontSize: 'var(--font-size-xs)',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        {isSending ? (
          <Loader2 size={16} className="spin" />
        ) : (
          <>
            <span>Send</span>
            <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
};
