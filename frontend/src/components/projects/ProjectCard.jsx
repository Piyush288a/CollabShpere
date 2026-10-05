import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';
import '../../styles/global.css';

export const ProjectCard = ({ project }) => {
  if (!project) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN':
        return {
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          label: 'OPEN',
        };
      case 'IN_PROGRESS':
        return {
          color: '#3B82F6',
          bgColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          label: 'IN PROGRESS',
        };
      case 'COMPLETED':
        return {
          color: '#6C655F',
          bgColor: 'rgba(108, 101, 95, 0.1)',
          borderColor: 'rgba(108, 101, 95, 0.2)',
          label: 'COMPLETED',
        };
      default:
        return {
          color: 'var(--color-text-muted)',
          bgColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-subtle)',
          label: status,
        };
    }
  };

  const statusStyle = getStatusStyle(project.status);
  const memberCount = project.memberIds ? project.memberIds.length : 1;

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
    }} className="project-card-hover">
      <div>
        {/* Header Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-md)',
        }}>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: statusStyle.color,
            backgroundColor: statusStyle.bgColor,
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            border: `1px solid ${statusStyle.borderColor}`,
            letterSpacing: '0.04em',
          }}>
            {statusStyle.label}
          </span>

          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
            {project.category && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--color-border-subtle)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                {project.category}
              </span>
            )}
            {project.difficulty && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--color-border-subtle)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                {project.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-main)',
          marginBottom: 'var(--space-xs)',
          lineHeight: 'var(--line-height-snug)',
        }}>
          <Link
            to={`/projects/${project._id}`}
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {project.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-lg)',
          lineHeight: 'var(--line-height-normal)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Skill Tags */}
        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-lg)',
          }}>
            {project.requiredSkills.slice(0, 4).map((skill, index) => (
              <span key={index} style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-main)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--color-border-subtle)',
              }}>
                {skill}
              </span>
            ))}
            {project.requiredSkills.length > 4 && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-subtle)',
                alignSelf: 'center',
              }}>
                +{project.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--color-border-subtle)',
        paddingTop: 'var(--space-md)',
        marginTop: 'var(--space-xs)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          <Users size={14} color="var(--color-accent)" />
          {memberCount} / {project.teamSize || 1} Members
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="btn btn-secondary"
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: 'var(--font-size-xs)',
            gap: '4px',
          }}
        >
          View Project
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <style>{`
        .project-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
          border-color: var(--color-border-strong) !important;
        }
      `}</style>
    </div>
  );
};
