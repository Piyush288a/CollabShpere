import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle, User as UserIcon } from 'lucide-react';
import { showcaseService } from '../../services/showcase.service';
import { useAuth } from '../../hooks/useAuth';

export const ShowcaseComments = ({ showcaseId, initialComments = [] }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await showcaseService.getComments(showcaseId, { limit: 50 });
      if (res?.results) {
        setComments(res.results);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [showcaseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting || !user) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await showcaseService.addComment(showcaseId, text.trim());
      if (res?.comment) {
        // Newest-first: insert new comment at the top
        setComments([res.comment, ...comments]);
        setText('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
      const msg = err.response?.data?.error?.message || 'Failed to post comment. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: 'clamp(var(--space-lg), 3vw, var(--space-2xl))',
        boxShadow: 'var(--shadow-sm)',
        marginTop: 'var(--space-2xl)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xl)' }}>
        <MessageSquare size={20} color="var(--color-accent)" />
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
          }}
        >
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-2xl)' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-sm) var(--space-md)',
                marginBottom: 'var(--space-md)',
                color: '#991B1B',
                fontSize: 'var(--font-size-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <textarea
              rows={2}
              placeholder="Add your thoughts or feedback on this showcase..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-main)',
                backgroundColor: 'var(--color-bg-surface)',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!text.trim() || submitting}
              style={{
                alignSelf: 'flex-end',
                padding: '0.75rem 1.25rem',
                gap: '6px',
              }}
            >
              <Send size={15} />
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {text.length}/1000
            </span>
          </div>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-bg-main)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
            marginBottom: 'var(--space-2xl)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          Please log in to share feedback or ask questions on this showcase.
        </div>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', color: 'var(--color-text-muted)' }}>
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) 0',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {comments.map((comment) => {
            const commentDate = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={comment._id}
                style={{
                  backgroundColor: 'var(--color-bg-main)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-dark)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      <UserIcon size={12} />
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-main)',
                      }}
                    >
                      Community Member
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {commentDate}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-main)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    paddingLeft: '32px',
                  }}
                >
                  {comment.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
