import React, { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/project.service';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectSkeleton } from '../components/projects/ProjectSkeleton';
import { Search, Filter, X, ChevronLeft, ChevronRight, RefreshCw, FolderSearch } from 'lucide-react';
import '../styles/global.css';

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Data Science',
  'DevOps',
  'Game Development',
  'Open Source',
  'Cybersecurity',
  'Other',
];

const DIFFICULTIES = ['All Difficulties', 'Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['All Statuses', 'OPEN', 'IN_PROGRESS', 'COMPLETED'];

export const ProjectDiscoveryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: currentPage,
        limit: 9,
      };

      if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
      if (selectedCategory && selectedCategory !== 'All Categories') queryParams.category = selectedCategory;
      if (selectedDifficulty && selectedDifficulty !== 'All Difficulties') queryParams.difficulty = selectedDifficulty;
      if (selectedStatus && selectedStatus !== 'All Statuses') queryParams.status = selectedStatus;

      const data = await projectService.getProjects(queryParams);
      setProjects(data.results || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err.message || 'Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedDifficulty, selectedStatus, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const hasActiveFilters = debouncedSearch || selectedCategory || selectedDifficulty || selectedStatus;

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-5xl)',
    }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-2xl)' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, var(--font-size-5xl))',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.035em',
            marginBottom: 'var(--space-xs)',
          }}>
            Discover Projects
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-muted)',
            lineHeight: 'var(--line-height-relaxed)',
            margin: 0,
          }}>
            Find ideas worth building and people worth building with.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Top Row: Search Input */}
          <div style={{
            position: 'relative',
            marginBottom: 'var(--space-md)',
          }}>
            <Search
              size={18}
              color="var(--color-text-subtle)"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '42px',
                paddingRight: searchTerm ? '38px' : '14px',
                height: '46px',
                fontSize: 'var(--font-size-base)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-subtle)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Bottom Row: Filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-sm)',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              flex: 1,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                marginRight: 'var(--space-xs)',
              }}>
                <Filter size={14} color="var(--color-accent)" />
                Filter:
              </div>

              {/* Category Select */}
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                style={selectStyle}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Difficulty Select */}
              <select
                value={selectedDifficulty}
                onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
                style={selectStyle}
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff === 'All Difficulties' ? '' : diff}>
                    {diff}
                  </option>
                ))}
              </select>

              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                style={selectStyle}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st === 'All Statuses' ? '' : st}>
                    {st === 'IN_PROGRESS' ? 'IN PROGRESS' : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="btn btn-outline"
                style={{
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent-border)',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
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
              onClick={fetchProjects}
              className="btn btn-outline"
              style={{ padding: '4px 12px', fontSize: 'var(--font-size-xs)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#B91C1C' }}
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {/* Results Grid / Loading / Empty */}
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-3xl)',
          }}>
            <ProjectSkeleton count={6} />
          </div>
        ) : projects.length > 0 ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-3xl)',
            }}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-md)',
                marginTop: 'var(--space-2xl)',
              }}>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: 'var(--font-size-xs)',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-muted)',
                }}>
                  Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="btn btn-outline"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: 'var(--font-size-xs)',
                    opacity: currentPage === pagination.totalPages ? 0.5 : 1,
                    cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty Search / Filter Results State */
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4xl) var(--space-xl)',
            textAlign: 'center',
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
              <FolderSearch size={28} />
            </div>
            <h3 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-xs)',
              color: 'var(--color-text-main)',
            }}>
              Nothing matches your search
            </h3>
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-muted)',
              maxWidth: '440px',
              margin: '0 auto var(--space-lg)',
            }}>
              Try adjusting your search query or clear the active filters to browse all projects.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const selectStyle = {
  padding: '6px 12px',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-main)',
  backgroundColor: 'var(--color-bg-primary)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  cursor: 'pointer',
};
