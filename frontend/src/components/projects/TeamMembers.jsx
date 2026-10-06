import React, { useState, useEffect } from 'react';
import { collaborationService } from '../../services/collaboration.service';
import { Crown, UserCheck, Code2, AlertCircle } from 'lucide-react';
import '../../styles/global.css';

export const TeamMembers = ({ projectId, ownerId }) => {
  const [members, setMembers] = useState([]);
  const [effectiveOwnerId, setEffectiveOwnerId] = useState(ownerId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await collaborationService.getProjectTeam(projectId);
        if (isMounted) {
          setMembers(data.members || []);
          if (data.ownerId) {
            setEffectiveOwnerId(data.ownerId);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch team members:', err);
          setError(err.message || 'Unable to load team roster.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (projectId) {
      fetchTeam();
    }

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-md)',
      }}>
        {[1, 2].map((idx) => (
          <div key={idx} style={{
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            height: '72px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        padding: 'var(--space-sm) 0',
      }}>
        {error}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        No team member data available.
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 'var(--space-md)',
    }}>
      {members.map((member) => {
        const isOwner = String(member._id) === String(effectiveOwnerId);
        return (
          <div
            key={member._id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}
          >
            {/* Avatar / Initials */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isOwner ? 'var(--color-accent)' : 'var(--color-dark)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              flexShrink: 0,
            }}>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(member.name)
              )}
            </div>

            {/* Member Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {member.name}
                </span>

                {isOwner ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent-soft)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-xs)',
                  }}>
                    <Crown size={11} /> Owner
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-bg-primary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-xs)',
                  }}>
                    <UserCheck size={11} /> Member
                  </span>
                )}
              </div>

              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {member.email}
              </div>

              {member.skills && member.skills.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} style={{
                      fontSize: '10px',
                      color: 'var(--color-text-subtle)',
                      backgroundColor: 'var(--color-bg-primary)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
