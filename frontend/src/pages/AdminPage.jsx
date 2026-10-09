import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/admin.service';
import {
  Shield,
  Users,
  FolderGit2,
  AlertTriangle,
  Award,
  CheckCircle,
  XCircle,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import '../styles/global.css';

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'projects' | 'reports'

  // Overview Stats
  const [stats, setStats] = useState(null);

  // Lists & Pagination
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  const [projects, setProjects] = useState([]);
  const [projectPagination, setProjectPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  const [reports, setReports] = useState([]);
  const [reportPagination, setReportPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  // Page Numbers
  const [userPage, setUserPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of element being updated
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Confirmation Modal for Deletion
  const [projectToDelete, setProjectToDelete] = useState(null);

  const currentAdminId = user?._id || user?.id;

  // Load Overview Stats
  const fetchStats = async () => {
    try {
      const res = await adminService.getStatistics();
      setStats(res?.statistics || null);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // Load Users
  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const res = await adminService.getUsers({ page, limit: 10 });
      setUsers(res?.results || []);
      setUserPagination(res?.pagination || { page: 1, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    }
  }, []);

  // Load Projects
  const fetchProjects = useCallback(async (page = 1) => {
    try {
      const res = await adminService.getProjects({ page, limit: 10 });
      setProjects(res?.results || []);
      setProjectPagination(res?.pagination || { page: 1, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error('Failed to fetch admin projects:', err);
    }
  }, []);

  // Load Reports
  const fetchReports = useCallback(async (page = 1) => {
    try {
      const res = await adminService.getReports({ page, limit: 10 });
      setReports(res?.results || []);
      setReportPagination(res?.pagination || { page: 1, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error('Failed to fetch admin reports:', err);
    }
  }, []);

  // Initial Load
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(userPage),
        fetchProjects(projectPage),
        fetchReports(reportPage),
      ]);
    } catch (err) {
      setError('Failed to load administrative data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage, fetchUsers]);

  useEffect(() => {
    fetchProjects(projectPage);
  }, [projectPage, fetchProjects]);

  useEffect(() => {
    fetchReports(reportPage);
  }, [reportPage, fetchReports]);

  // Toggle User Status (Active <-> Suspended)
  const handleToggleUserStatus = async (targetUser) => {
    const userId = targetUser._id;
    if (String(userId) === String(currentAdminId) && targetUser.status === 'active') {
      setError('Admins cannot suspend their own account.');
      return;
    }

    const newStatus = targetUser.status === 'suspended' ? 'active' : 'suspended';
    setActionLoading(`user-${userId}`);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.setUserStatus(userId, newStatus);
      setSuccessMsg(`User "${targetUser.name}" status updated to ${newStatus.toUpperCase()}.`);
      await Promise.all([fetchUsers(userPage), fetchStats()]);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update user status.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Confirm and Delete Project
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const projectId = projectToDelete._id;

    setActionLoading(`delete-project-${projectId}`);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.deleteProject(projectId);
      setSuccessMsg(`Project "${projectToDelete.title}" and associated data deleted successfully.`);
      setProjectToDelete(null);
      await Promise.all([fetchProjects(projectPage), fetchStats()]);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete project.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Decide Report (Resolve or Dismiss)
  const handleDecideReport = async (reportId, status) => {
    setActionLoading(`report-${reportId}`);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.decideReport(reportId, status);
      setSuccessMsg(`Report status updated to ${status}.`);
      await Promise.all([fetchReports(reportPage), fetchStats()]);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update report status.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Local Search Filtering for Tables
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.status?.toLowerCase().includes(q)
    );
  });

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q) ||
      p.difficulty?.toLowerCase().includes(q)
    );
  });

  const filteredReports = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.reason?.toLowerCase().includes(q) ||
      r.targetType?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: 'calc(100vh - 64px)', paddingBottom: 'var(--space-3xl)' }}>
      {/* Header Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: 'var(--space-2xl) 0',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <Shield size={18} />
                </span>
                <h1
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-extrabold)',
                    color: 'var(--color-text-main)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Admin Control Panel
                </h1>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                Platform management, user access control, project moderation, and content reports.
              </p>
            </div>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-xs)' }}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              Refresh System Metrics
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Success Feedback Alert */}
        {successMsg && (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              padding: 'var(--space-md) var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontWeight: 'bold' }}
            >
              ×
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: 'var(--space-md) var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 'bold' }}
            >
              ×
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            borderBottom: '1px solid var(--color-border-subtle)',
            marginBottom: 'var(--space-2xl)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Statistics', icon: Shield },
            { id: 'users', label: `Users (${stats?.users?.total || userPagination.totalCount || 0})`, icon: Users },
            { id: 'projects', label: `Projects (${stats?.projects?.total || projectPagination.totalCount || 0})`, icon: FolderGit2 },
            { id: 'reports', label: `Reports (${stats?.reports?.byStatus?.PENDING || 0} Pending)`, icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: 'none',
                  borderBottom: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontWeight: isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Loading Skeleton */}
        {loading && !stats ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <Loader2 size={36} className="spin" style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)' }}>
              Loading administrative system data...
            </p>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW & STATS TAB */}
            {activeTab === 'overview' && stats && (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'var(--space-lg)',
                    marginBottom: 'var(--space-2xl)',
                  }}
                >
                  {/* Total Users */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: 'var(--space-xl)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveTab('users')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Registered Users
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                        <Users size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.users?.total || 0}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>Students: <strong>{stats.users?.byRole?.student || 0}</strong></span>
                      <span>Admins: <strong>{stats.users?.byRole?.admin || 0}</strong></span>
                      <span style={{ color: stats.users?.byStatus?.suspended > 0 ? '#DC2626' : 'inherit' }}>
                        Suspended: <strong>{stats.users?.byStatus?.suspended || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Total Projects */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: 'var(--space-xl)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveTab('projects')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Created Projects
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(22, 19, 17, 0.08)', color: 'var(--color-dark)' }}>
                        <FolderGit2 size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.projects?.total || 0}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>Open: <strong>{stats.projects?.byStatus?.OPEN || 0}</strong></span>
                      <span>In Progress: <strong>{stats.projects?.byStatus?.IN_PROGRESS || 0}</strong></span>
                      <span>Completed: <strong>{stats.projects?.byStatus?.COMPLETED || 0}</strong></span>
                    </div>
                  </div>

                  {/* Total Showcases */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: 'var(--space-xl)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Public Showcases
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#D97706' }}>
                        <Award size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.showcases?.total || 0}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Published project portfolios
                    </div>
                  </div>

                  {/* Content Reports */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: 'var(--space-xl)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveTab('reports')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Content Reports
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
                        <AlertTriangle size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.reports?.total || 0}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ color: stats.reports?.byStatus?.PENDING > 0 ? '#DC2626' : 'inherit', fontWeight: 'bold' }}>
                        Pending: {stats.reports?.byStatus?.PENDING || 0}
                      </span>
                      <span>Resolved: {stats.reports?.byStatus?.RESOLVED || 0}</span>
                      <span>Dismissed: {stats.reports?.byStatus?.DISMISSED || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. USER MANAGEMENT TAB */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem 0.65rem 2.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                        backgroundColor: 'var(--color-bg-surface)',
                        color: 'var(--color-text-main)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    overflowX: 'auto',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 'var(--space-xl)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>USER</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>ROLE</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>REGISTERED</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelf = String(u._id) === String(currentAdminId);
                          const isSuspended = u.status === 'suspended';

                          return (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{u.name}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    backgroundColor: u.role === 'admin' ? 'var(--color-accent-soft)' : 'rgba(22, 19, 17, 0.06)',
                                    color: u.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-main)',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    backgroundColor: isSuspended ? '#FEF2F2' : '#F0FDF4',
                                    color: isSuspended ? '#DC2626' : '#166534',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {u.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  disabled={isSelf || actionLoading === `user-${u._id}`}
                                  className={isSuspended ? 'btn btn-primary' : 'btn btn-secondary'}
                                  style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '4px' }}
                                  title={isSelf ? 'Admins cannot suspend their own account' : ''}
                                >
                                  {actionLoading === `user-${u._id}` ? (
                                    <Loader2 size={14} className="spin" />
                                  ) : isSuspended ? (
                                    <>
                                      <UserCheck size={14} /> Reactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserX size={14} /> Suspend
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Users Pagination Controls */}
                {userPagination.totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                    <button
                      className="btn btn-secondary"
                      disabled={!userPagination.hasPrevPage}
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                      Page {userPagination.page} of {userPagination.totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      disabled={!userPagination.hasNextPage}
                      onClick={() => setUserPage((p) => p + 1)}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. PROJECT MODERATION TAB */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search projects by title or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem 0.65rem 2.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                        backgroundColor: 'var(--color-bg-surface)',
                        color: 'var(--color-text-main)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    overflowX: 'auto',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 'var(--space-xl)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>PROJECT TITLE</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>CATEGORY</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>CREATED</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No projects found.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p) => (
                          <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{p.title}</div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                Difficulty: {p.difficulty} • Team size: {p.teamSize}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                              {p.category}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  backgroundColor: 'rgba(22, 19, 17, 0.06)',
                                  color: 'var(--color-text-main)',
                                }}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => setProjectToDelete(p)}
                                disabled={actionLoading === `delete-project-${p._id}`}
                                className="btn btn-secondary"
                                style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', color: '#DC2626', borderColor: '#FCA5A5', gap: '4px' }}
                              >
                                {actionLoading === `delete-project-${p._id}` ? (
                                  <Loader2 size={14} className="spin" />
                                ) : (
                                  <>
                                    <Trash2 size={14} /> Delete
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Projects Pagination Controls */}
                {projectPagination.totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                    <button
                      className="btn btn-secondary"
                      disabled={!projectPagination.hasPrevPage}
                      onClick={() => setProjectPage((p) => Math.max(1, p - 1))}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                      Page {projectPagination.page} of {projectPagination.totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      disabled={!projectPagination.hasNextPage}
                      onClick={() => setProjectPage((p) => p + 1)}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. REPORT MANAGEMENT TAB */}
            {activeTab === 'reports' && (
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    overflowX: 'auto',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 'var(--space-xl)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>REPORT REASON</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>TARGET TYPE</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>FILED AT</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold', textAlign: 'right' }}>MODERATION ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No reports filed. All community content is clear!
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map((r) => (
                          <tr key={r._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{r.reason}</div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                Target ID: {r.targetId} • Reporter: {r.reporterId}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  backgroundColor: 'rgba(22, 19, 17, 0.06)',
                                  color: 'var(--color-text-main)',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {r.targetType}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  backgroundColor: r.status === 'PENDING' ? '#FEF2F2' : r.status === 'RESOLVED' ? '#F0FDF4' : 'rgba(22, 19, 17, 0.06)',
                                  color: r.status === 'PENDING' ? '#DC2626' : r.status === 'RESOLVED' ? '#166534' : 'var(--color-text-muted)',
                                }}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              {r.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => handleDecideReport(r._id, 'RESOLVED')}
                                    disabled={actionLoading === `report-${r._id}`}
                                    className="btn btn-primary"
                                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', backgroundColor: '#166534', borderColor: '#166534', gap: '4px' }}
                                  >
                                    <CheckCircle size={14} /> Resolve
                                  </button>
                                  <button
                                    onClick={() => handleDecideReport(r._id, 'DISMISSED')}
                                    disabled={actionLoading === `report-${r._id}`}
                                    className="btn btn-secondary"
                                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '4px' }}
                                  >
                                    <XCircle size={14} /> Dismiss
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                                  Decided ({r.status})
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Reports Pagination Controls */}
                {reportPagination.totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                    <button
                      className="btn btn-secondary"
                      disabled={!reportPagination.hasPrevPage}
                      onClick={() => setReportPage((p) => Math.max(1, p - 1))}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                      Page {reportPagination.page} of {reportPagination.totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      disabled={!reportPagination.hasNextPage}
                      onClick={() => setReportPage((p) => p + 1)}
                      style={{ fontSize: 'var(--font-size-xs)', gap: '4px' }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-2xl)',
              maxWidth: '480px',
              width: '100%',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: '#DC2626', marginBottom: 'var(--space-md)' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>
                Confirm Project Deletion
              </h3>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>"{projectToDelete.title}"</strong>?
              This will permanently delete the project and all associated tasks, messages, requests, and showcases.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setProjectToDelete(null)}
                disabled={!!actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmDeleteProject}
                disabled={!!actionLoading}
                style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', gap: '6px' }}
              >
                {actionLoading ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
