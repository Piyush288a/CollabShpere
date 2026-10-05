import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/project.service';
import { ROUTES } from '../constants/routes.constants';
import { ArrowLeft, Users, Calendar, ExternalLink, Code2, Layers, RefreshCw, FolderX } from 'lucide-react';
import '../styles/global.css';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data.project);
    } catch (err) {
      console.error('Failed to load project details:', err);
      setError(err.message || 'Project not found or unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-3xl)',
            height: '380px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4xl) var(--space-xl)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)',
            }}>
              <FolderX size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-xs)' }}>
              Project Not Found
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
              {error || 'The project you are looking for does not exist or has been removed.'}
            </p>
            <Link to={ROUTES.PROJECTS} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              <ArrowLeft size={16} />
              Back to Discover Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberCount = project.memberIds ? project.memberIds.length : 1;

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-5xl)',
    }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Navigation Back Link */}
        <Link
          to={ROUTES.PROJECTS}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-xl)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Project Container Card */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Header Metadata */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)',
          }}>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-extrabold)',
              color: project.status === 'OPEN' ? '#10B981' : project.status === 'IN_PROGRESS' ? '#3B82F6' : '#6C655F',
              backgroundColor: project.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : project.status === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(108, 101, 95, 0.1)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em',
              border: '1px solid var(--color-border-subtle)',
            }}>
              STATUS: {project.status}
            </span>

            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
              <span style={badgeStyle}>
                <Layers size={13} color="var(--color-accent)" />
                {project.category}
              </span>
              <span style={badgeStyle}>
                {project.difficulty}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, var(--font-size-4xl))',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.03em',
            lineHeight: 'var(--line-height-snug)',
            marginBottom: 'var(--space-lg)',
          }}>
            {project.title}
          </h1>

          {/* Key Details Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-md)',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
            marginBottom: 'var(--space-2xl)',
          }}>
            <div>
              <span style={metaLabelStyle}>Team Capacity</span>
              <div style={metaValueStyle}>
                <Users size={16} color="var(--color-accent)" />
                {memberCount} / {project.teamSize} Members
              </div>
            </div>

            <div>
              <span style={metaLabelStyle}>Target Deadline</span>
              <div style={metaValueStyle}>
                <Calendar size={16} color="var(--color-accent)" />
                {formatDate(project.deadline)}
              </div>
            </div>

            <div>
              <span style={metaLabelStyle}>Posted On</span>
              <div style={metaValueStyle}>
                {formatDate(project.createdAt)}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h3 style={sectionHeadingStyle}>About the Project</h3>
            <div style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-main)',
              lineHeight: 'var(--line-height-relaxed)',
              whiteSpace: 'pre-wrap',
            }}>
              {project.description}
            </div>
          </div>

          {/* Required Skills Section */}
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3 style={sectionHeadingStyle}>
                <Code2 size={16} color="var(--color-accent)" inline style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Required Technologies & Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {project.requiredSkills.map((skill, idx) => (
                  <span key={idx} style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-main)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repository Link (if present) */}
          {project.repositoryUrl && (
            <div style={{
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                View Repository
                <ExternalLink size={15} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-main)',
  backgroundColor: 'var(--color-bg-primary)',
  padding: '4px 10px',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid var(--color-border-subtle)',
  fontWeight: 'var(--font-weight-medium)',
};

const metaLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  fontWeight: 'var(--font-weight-medium)',
  display: 'block',
  marginBottom: '4px',
};

const metaValueStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-main)',
};

const sectionHeadingStyle = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-main)',
  marginBottom: 'var(--space-sm)',
};
