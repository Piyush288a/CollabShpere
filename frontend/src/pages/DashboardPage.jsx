import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/project.service';
import { ROUTES } from '../constants/routes.constants';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectSkeleton } from '../components/projects/ProjectSkeleton';
import { Compass, Plus, ArrowRight, FolderGit2, Sparkles, RefreshCw } from 'lucide-react';
import '../styles/global.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [discoverProjects, setDiscoverProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch list of projects (limit 20 to find user projects and community projects)
      const data = await projectService.getProjects({ limit: 30 });
      const allProjects = data.results || [];

      // Filter user's owned or joined projects
      const userId = user?._id || user?.id;
      const userProjects = allProjects.filter((p) => {
        const ownerId = typeof p.ownerId === 'object' ? p.ownerId?._id : p.ownerId;
        const memberIds = p.memberIds || [];
        const isOwner = String(ownerId) === String(userId);
        const isMember = memberIds.some((m) => String(m) === String(userId));
        return isOwner || isMember;
      });

      // Filter discover projects (open projects not owned by user)
      const discoverable = allProjects
        .filter((p) => {
          const ownerId = typeof p.ownerId === 'object' ? p.ownerId?._id : p.ownerId;
          return String(ownerId) !== String(userId);
        })
        .slice(0, 4);

      setMyProjects(userProjects);
      setDiscoverProjects(discoverable.length > 0 ? discoverable : allProjects.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-4xl)',
    }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Welcome Header */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-2xl))',
          marginBottom: 'var(--space-3xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-lg)',
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-xs)',
              }}>
                <Sparkles size={13} />
                WELCOME BACK
              </div>
              <h1 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, var(--font-size-4xl))',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-text-main)',
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-xs)',
              }}>
                Good to see you, {firstName}.
              </h1>
              <p style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text-muted)',
                margin: 0,
              }}>
                Find something worth building or launch a new idea.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}>
              <Link to={ROUTES.PROJECTS} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
                <Compass size={16} color="var(--color-accent)" />
                Explore Projects
              </Link>
              <Link to={ROUTES.CREATE_PROJECT} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                <Plus size={16} />
                Create Project
              </Link>
            </div>
          </div>
        </div>

        {/* Error Alert with Retry */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#B91C1C',
            fontSize: 'var(--font-size-sm)',
          }}>
            <span>{error}</span>
            <button
              onClick={fetchDashboardData}
              className="btn btn-outline"
              style={{ padding: '4px 12px', fontSize: 'var(--font-size-xs)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#B91C1C' }}
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {/* Section 1: MY PROJECTS */}
        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-xl)',
          }}>
            <div>
              <h2 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-text-main)',
                marginBottom: '2px',
              }}>
                My Projects
              </h2>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                Projects you created or joined as a team member.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
            }}>
              <ProjectSkeleton count={2} />
            </div>
          ) : myProjects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
            }}>
              {myProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            /* Empty My Projects State */
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3xl) var(--space-xl)',
              textAlign: 'center',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-md)',
              }}>
                <FolderGit2 size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--space-xs)',
              }}>
                You haven't created a project yet
              </h3>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                maxWidth: '420px',
                margin: '0 auto var(--space-lg)',
              }}>
                Start by sharing a project idea to recruit student teammates across your campus.
              </p>
              <Link to={ROUTES.CREATE_PROJECT} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                <Plus size={16} />
                Create your first project
              </Link>
            </div>
          )}
        </section>

        {/* Section 2: DISCOVER */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-xl)',
          }}>
            <div>
              <h2 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--color-text-main)',
                marginBottom: '2px',
              }}>
                Projects You Might Like
              </h2>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                Explore open project opportunities across campus.
              </p>
            </div>

            <Link
              to={ROUTES.PROJECTS}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-accent)',
              }}
            >
              View all projects
              <ArrowRight size={15} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
            }}>
              <ProjectSkeleton count={3} />
            </div>
          ) : discoverProjects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-xl)',
            }}>
              {discoverProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)',
            }}>
              No discoverable projects found right now. Check back soon or create your own!
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
