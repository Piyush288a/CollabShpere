import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, Search, AlertCircle, Award } from 'lucide-react';
import { showcaseService } from '../services/showcase.service';
import { projectService } from '../services/project.service';
import { ShowcaseCard } from '../components/showcases/ShowcaseCard';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes.constants';

export const ShowcaseFeedPage = () => {
  const { user } = useAuth();
  const [showcases, setShowcases] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchShowcases = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await showcaseService.getShowcases({ page, limit: 9 });
      
      const items = res?.results || [];
      const pag = res?.pagination || { page: 1, totalPages: 1 };
      
      setShowcases(items);
      setPagination(pag);

      // Fetch corresponding project details for each showcase
      const projectIds = [...new Set(items.map((s) => s.projectId).filter(Boolean))];
      const projectDetailsMap = {};

      await Promise.all(
        projectIds.map(async (pid) => {
          try {
            const pRes = await projectService.getProjectById(pid);
            if (pRes?.project) {
              projectDetailsMap[pid] = pRes.project;
            }
          } catch (err) {
            console.error(`Failed to fetch project ${pid}:`, err);
          }
        })
      );

      setProjectMap((prev) => ({ ...prev, ...projectDetailsMap }));
    } catch (err) {
      console.error('Failed to fetch showcase feed:', err);
      setError('Failed to load showcase feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcases(currentPage);
  }, [currentPage]);

  const filteredShowcases = showcases.filter((showcase) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = showcase.title?.toLowerCase().includes(q);
    const descMatch = showcase.description?.toLowerCase().includes(q);
    const techMatch = showcase.technologies?.some((t) => t.toLowerCase().includes(q));
    const projMatch = projectMap[showcase.projectId]?.title?.toLowerCase().includes(q);
    return titleMatch || descMatch || techMatch || projMatch;
  });

  return (
    <div style={{ paddingBottom: 'var(--space-3xl)' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl)) 0',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Award size={14} />
              Public Project Gallery
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexWrap: 'wrap',
                gap: 'var(--space-md)',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(var(--font-size-2xl), 4vw, var(--font-size-4xl))',
                    fontWeight: 'var(--font-weight-extrabold)',
                    color: 'var(--color-text-main)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  Showcase Gallery
                </h1>
                <p
                  style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text-muted)',
                    maxWidth: '600px',
                  }}
                >
                  Discover finished projects, live demos, and technical innovations created by campus teams.
                </p>
              </div>

              {user && (
                <Link to="/showcases/create" className="btn btn-primary" style={{ gap: '6px' }}>
                  <Plus size={16} />
                  Showcase Your Project
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.6rem 1rem',
            marginBottom: 'var(--space-2xl)',
            maxWidth: '560px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Search size={18} color="var(--color-text-muted)" style={{ marginRight: 'var(--space-xs)' }} />
          <input
            type="text"
            placeholder="Search showcases by title, tech stack, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-main)',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: '#991B1B',
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-xl)',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: 'var(--space-xl)',
                  height: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              >
                <div style={{ height: '24px', width: '60%', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-xs)' }} />
                <div style={{ height: '60px', width: '100%', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-xs)' }} />
                <div style={{ height: '32px', width: '40%', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-xs)' }} />
              </div>
            ))}
          </div>
        ) : filteredShowcases.length === 0 ? (
          /* Empty State */
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: 'var(--space-3xl) var(--space-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Sparkles size={48} color="var(--color-accent)" style={{ margin: '0 auto var(--space-md)' }} />
            <h3
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-main)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              {searchQuery ? 'No Matching Showcases Found' : 'No Showcases Yet'}
            </h3>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-lg)',
                maxWidth: '480px',
                margin: '0 auto var(--space-lg)',
              }}
            >
              {searchQuery
                ? `No showcase matched "${searchQuery}". Try a different keyword or stack.`
                : 'Be the first team to feature a completed project in the CollabSphere Showcase Gallery!'}
            </p>
            {user && (
              <Link to="/showcases/create" className="btn btn-primary" style={{ gap: '6px' }}>
                <Plus size={16} />
                Showcase Your Project
              </Link>
            )}
          </div>
        ) : (
          /* Showcase Cards Grid */
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--space-xl)',
                marginBottom: 'var(--space-3xl)',
              }}
            >
              {filteredShowcases.map((showcase) => (
                <ShowcaseCard
                  key={showcase._id}
                  showcase={showcase}
                  projectDetails={projectMap[showcase.projectId]}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-md)',
                }}
              >
                <button
                  className="btn btn-secondary"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ fontSize: 'var(--font-size-xs)' }}
                >
                  Previous
                </button>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{ fontSize: 'var(--font-size-xs)' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
