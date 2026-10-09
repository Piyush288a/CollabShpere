import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, ExternalLink, Github, ArrowRight, Sparkles } from 'lucide-react';
import { showcaseService } from '../../services/showcase.service';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes.constants';

export const ShowcaseCard = ({ showcase: initialShowcase, projectDetails }) => {
  const { user } = useAuth();
  const [showcase, setShowcase] = useState(initialShowcase);
  const [isLiking, setIsLiking] = useState(false);

  const currentUserId = user?._id || user?.id;
  const isLiked = showcase.likedBy?.some((id) => String(id) === String(currentUserId));
  const commentCount = showcase.comments?.length || 0;

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || isLiking) return;

    setIsLiking(true);

    // Optimistic UI update
    const previousShowcase = { ...showcase };
    const newLikedBy = isLiked
      ? showcase.likedBy.filter((id) => String(id) !== String(currentUserId))
      : [...(showcase.likedBy || []), currentUserId];
    
    setShowcase({
      ...showcase,
      likedBy: newLikedBy,
      likesCount: newLikedBy.length,
    });

    try {
      let res;
      if (isLiked) {
        res = await showcaseService.unlikeShowcase(showcase._id);
      } else {
        res = await showcaseService.likeShowcase(showcase._id);
      }
      if (res?.showcase) {
        setShowcase(res.showcase);
      }
    } catch (err) {
      console.error('Failed to update like status:', err);
      // Rollback optimistic update on failure
      setShowcase(previousShowcase);
    } finally {
      setIsLiking(false);
    }
  };

  const formattedDate = showcase.createdAt
    ? new Date(showcase.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: 'var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner / Project Badge */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={12} />
              Showcase
            </span>
            {projectDetails?.category && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-main)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {projectDetails.category}
              </span>
            )}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/showcases/${showcase._id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
              marginBottom: 'var(--space-xs)',
              lineHeight: 1.3,
            }}
          >
            {showcase.title}
          </h3>
        </Link>

        {/* Linked Project Reference */}
        {projectDetails?.title && (
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            <Link
              to={ROUTES.PROJECT_DETAIL.replace(':id', showcase.projectId)}
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Project: {projectDetails.title}
            </Link>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {showcase.description}
        </p>

        {/* Image Preview (if present) */}
        {showcase.images && showcase.images.length > 0 && (
          <div
            style={{
              marginBottom: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              maxHeight: '180px',
              backgroundColor: 'var(--color-bg-main)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <img
              src={showcase.images[0]}
              alt={showcase.title}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Technologies Tags */}
        {showcase.technologies && showcase.technologies.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {showcase.technologies.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                  backgroundColor: 'rgba(22, 19, 17, 0.04)',
                  color: 'var(--color-text-main)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions / Metadata */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 'var(--space-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Like & Comment Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button
            onClick={handleToggleLike}
            disabled={!user || isLiking}
            title={user ? (isLiked ? 'Unlike' : 'Like') : 'Log in to like'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              cursor: user ? 'pointer' : 'default',
              color: isLiked ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              padding: '4px 6px',
              borderRadius: 'var(--radius-xs)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Heart size={16} fill={isLiked ? 'var(--color-accent)' : 'none'} />
            <span>{showcase.likesCount || 0}</span>
          </button>

          <Link
            to={`/showcases/${showcase._id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              padding: '4px 6px',
            }}
          >
            <MessageSquare size={16} />
            <span>{commentCount}</span>
          </Link>
        </div>

        {/* Right: Links / Details CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          {showcase.githubUrl && (
            <a
              href={showcase.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository"
              style={{
                color: 'var(--color-text-muted)',
                padding: '4px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Github size={16} />
            </a>
          )}
          {showcase.demoUrl && (
            <a
              href={showcase.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Live Demo"
              style={{
                color: 'var(--color-accent)',
                padding: '4px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ExternalLink size={16} />
            </a>
          )}
          <Link
            to={`/showcases/${showcase._id}`}
            className="btn btn-secondary"
            style={{
              fontSize: 'var(--font-size-xs)',
              padding: '4px 10px',
              gap: '4px',
            }}
          >
            View
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
