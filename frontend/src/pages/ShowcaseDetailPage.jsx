import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ExternalLink, Github, ArrowLeft, Sparkles, Folder, Calendar, AlertCircle } from 'lucide-react';
import { showcaseService } from '../services/showcase.service';
import { projectService } from '../services/project.service';
import { ShowcaseComments } from '../components/showcases/ShowcaseComments';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes.constants';

export const ShowcaseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showcase, setShowcase] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await showcaseService.getShowcaseById(id);
        const sc = res?.showcase;
        setShowcase(sc);

        if (sc?.projectId) {
          try {
            const pRes = await projectService.getProjectById(sc.projectId);
            setProject(pRes?.project || null);
          } catch (pErr) {
            console.error('Failed to fetch project detail for showcase:', pErr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch showcase by id:', err);
        setError('Showcase not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const isLiked = showcase?.likedBy?.some((uid) => String(uid) === String(currentUserId));

  const handleToggleLike = async () => {
    if (!user || isLiking || !showcase) return;

    setIsLiking(true);

    const previousShowcase = { ...showcase };
    const newLikedBy = isLiked
      ? showcase.likedBy.filter((uid) => String(uid) !== String(currentUserId))
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
      console.error('Failed to update like state:', err);
      setShowcase(previousShowcase);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading showcase...</div>
      </div>
    );
  }

  if (error || !showcase) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0' }}>
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-3xl) var(--space-xl)',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto var(--space-md)' }} />
          <h3
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
              marginBottom: 'var(--space-xs)',
            }}
          >
            Showcase Not Found
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            The requested showcase does not exist or may have been removed.
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/showcases')}>
            Back to Showcase Gallery
          </button>
        </div>
      </div>
    );
  }

  const createdDate = showcase.createdAt
    ? new Date(showcase.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div style={{ paddingBottom: 'var(--space-3xl)' }}>
      {/* Back Button */}
      <div className="container" style={{ paddingTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <Link
          to="/showcases"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Showcase Gallery
        </Link>
      </div>

      <div className="container">
        {/* Main Showcase Container */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Top Badges & Meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-md)',
            }}
          >
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
              {project?.category && (
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
                  {project.category}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              <Calendar size={14} />
              <span>Published {createdDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(var(--font-size-2xl), 4vw, var(--font-size-4xl))',
              fontWeight: 'var(--font-weight-extrabold)',
              color: 'var(--color-text-main)',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-md)',
              lineHeight: 1.2,
            }}
          >
            {showcase.title}
          </h1>

          {/* Associated Project Info Banner */}
          {project && (
            <div
              style={{
                backgroundColor: 'var(--color-bg-main)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md) var(--space-lg)',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: 'var(--space-2xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <Folder size={18} color="var(--color-accent)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                    Original Project
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)' }}>
                    {project.title}
                  </div>
                </div>
              </div>

              <Link
                to={ROUTES.PROJECT_DETAIL.replace(':id', showcase.projectId)}
                className="btn btn-secondary"
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                View Project Details
              </Link>
            </div>
          )}

          {/* External Action Links (GitHub & Live Demo) & Like Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-2xl)',
              paddingBottom: 'var(--space-lg)',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            {/* Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {showcase.demoUrl && (
                <a
                  href={showcase.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ gap: '6px' }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {showcase.githubUrl && (
                <a
                  href={showcase.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ gap: '6px' }}
                >
                  <Github size={16} />
                  GitHub Repository
                </a>
              )}
            </div>

            {/* Like Toggle */}
            <button
              onClick={handleToggleLike}
              disabled={!user || isLiking}
              title={user ? (isLiked ? 'Unlike showcase' : 'Like showcase') : 'Log in to like'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                backgroundColor: isLiked ? 'var(--color-accent-soft)' : 'var(--color-bg-main)',
                border: isLiked ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                color: isLiked ? 'var(--color-accent)' : 'var(--color-text-main)',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-sm)',
                cursor: user ? 'pointer' : 'default',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Heart size={18} fill={isLiked ? 'var(--color-accent)' : 'none'} />
              <span>{showcase.likesCount || 0} {showcase.likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>

          {/* Image Gallery */}
          {showcase.images && showcase.images.length > 0 && (
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-main)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Project Screenshots
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-md)',
                }}
              >
                {showcase.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-main)',
                      maxHeight: '300px',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Screenshot ${idx + 1}`}
                      style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Stack */}
          {showcase.technologies && showcase.technologies.length > 0 && (
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-main)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Technologies & Tools
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {showcase.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      backgroundColor: 'var(--color-bg-main)',
                      color: 'var(--color-text-main)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          <div>
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-main)',
                marginBottom: 'var(--space-md)',
              }}
            >
              About this Project
            </h3>
            <div
              style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text-main)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
            >
              {showcase.description}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <ShowcaseComments showcaseId={showcase._id} initialComments={showcase.comments || []} />
      </div>
    </div>
  );
};
