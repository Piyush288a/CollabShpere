import React, { useState, useEffect } from 'react';
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
  Filter,
} from 'lucide-react';
import '../styles/global.css';

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'projects' | 'reports'
  
  // Data states
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, projectsRes, reportsRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers({ limit: 50 }),
        adminService.getProjects({ limit: 50 }),
        adminService.getReports({ limit: 50 }),
      ]);

      setStats(statsRes.statistics);
      setUsersList(usersRes.results || []);
      setProjectsList(projectsRes.results || []);
      setReportsList(reportsRes.results || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'suspended' ? 'active' : 'suspended';
    setActionLoading(`user-${targetUser.id}`);
    setError(null);
    setSuccessMsg(null);
    try {
      await adminService.setUserStatus(targetUser.id, newStatus);
      setSuccessMsg(`User "${targetUser.name}" has been ${newStatus === 'suspended' ? 'suspended' : 're-activated'}.`);
      await loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete project "${project.title}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(`project-${project.id}`);
    setError(null);
    setSuccessMsg(null);
    try {
      await adminService.deleteProject(project.id);
      setSuccessMsg(`Project "${project.title}" and its associated data were deleted.`);
      await loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecideReport = async (reportId, status) => {
    setActionLoading(`report-${reportId}`);
    setError(null);
    setSuccessMsg(null);
    try {
      await adminService.decideReport(reportId, status);
      setSuccessMsg(`Report marked as ${status}.`);
      await loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to update report status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered Lists
  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projectsList.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--color-accent)" style={{ marginBottom: 'var(--space-md)' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>You do not have administrative privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: 'calc(100vh - 64px)', padding: 'var(--space-2xl) 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2xl)',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Shield size={28} color="var(--color-accent)" />
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)' }}>
                Admin Portal
              </h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              System overview, moderation, user management, and content control.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
            fontSize: 'var(--font-size-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}>
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
            fontSize: 'var(--font-size-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}>
            <CheckCircle size={18} />
            {successMsg}
          </div>
        )}

        {/* Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-xs)',
          borderBottom: '1px solid var(--color-border-subtle)',
          marginBottom: 'var(--space-xl)',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: 'Overview & Stats', icon: Shield },
            { id: 'users', label: `Users (${stats?.users?.total || 0})`, icon: Users },
            { id: 'projects', label: `Projects (${stats?.projects?.total || 0})`, icon: FolderGit2 },
            { id: 'reports', label: `Reports (${stats?.reports?.byStatus?.PENDING || 0} Pending)`, icon: AlertTriangle },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Loading Spinner */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <Loader2 size={36} className="spin" style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)' }}>
              Loading administrative metrics...
            </p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'var(--space-lg)',
                }}>
                  {/* Users Card */}
                  <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)' }}>
                        TOTAL USERS
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 90, 54, 0.1)', color: 'var(--color-accent)' }}>
                        <Users size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.users.total}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px' }}>
                      <span>Students: <strong>{stats.users.byRole.student}</strong></span>
                      <span>Admins: <strong>{stats.users.byRole.admin}</strong></span>
                      <span>Suspended: <strong style={{ color: stats.users.byStatus.suspended > 0 ? '#DC2626' : 'inherit' }}>{stats.users.byStatus.suspended}</strong></span>
                    </div>
                  </div>

                  {/* Projects Card */}
                  <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)' }}>
                        TOTAL PROJECTS
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(22, 19, 17, 0.08)', color: 'var(--color-dark)' }}>
                        <FolderGit2 size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.projects.total}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px' }}>
                      <span>Open: <strong>{stats.projects.byStatus.OPEN}</strong></span>
                      <span>In Progress: <strong>{stats.projects.byStatus.IN_PROGRESS}</strong></span>
                      <span>Completed: <strong>{stats.projects.byStatus.COMPLETED}</strong></span>
                    </div>
                  </div>

                  {/* Showcases Card */}
                  <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)' }}>
                        SHOWCASES
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#D97706' }}>
                        <Award size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.showcases.total}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Published community showcases
                    </div>
                  </div>

                  {/* Reports Card */}
                  <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-muted)' }}>
                        CONTENT REPORTS
                      </span>
                      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
                        <AlertTriangle size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
                      {stats.reports.total}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: '12px' }}>
                      <span style={{ color: stats.reports.byStatus.PENDING > 0 ? '#DC2626' : 'inherit', fontWeight: 'bold' }}>
                        Pending: {stats.reports.byStatus.PENDING}
                      </span>
                      <span>Resolved: {stats.reports.byStatus.RESOLVED}</span>
                      <span>Dismissed: {stats.reports.byStatus.DISMISSED}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      className="input"
                      placeholder="Search users by name, email, or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>USER</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>ROLE</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>JOINED</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No users match the search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelf = String(u.id) === String(user?.id) || String(u.id) === String(user?._id);
                          return (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{u.name}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: 'var(--font-size-xs)',
                                  fontWeight: 'bold',
                                  backgroundColor: u.role === 'admin' ? 'var(--color-accent-soft)' : 'rgba(22, 19, 17, 0.06)',
                                  color: u.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-main)',
                                }}>
                                  {u.role?.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: 'var(--font-size-xs)',
                                  fontWeight: 'bold',
                                  backgroundColor: u.status === 'suspended' ? '#FEF2F2' : '#F0FDF4',
                                  color: u.status === 'suspended' ? '#DC2626' : '#166534',
                                }}>
                                  {u.status?.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  disabled={isSelf || actionLoading === `user-${u.id}`}
                                  className={u.status === 'suspended' ? 'btn btn-primary' : 'btn btn-secondary'}
                                  style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '4px' }}
                                  title={isSelf ? 'Admins cannot suspend their own account' : ''}
                                >
                                  {actionLoading === `user-${u.id}` ? (
                                    <Loader2 size={14} className="spin" />
                                  ) : u.status === 'suspended' ? (
                                    <>
                                      <UserCheck size={14} /> Unsuspend
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
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      className="input"
                      placeholder="Search projects by title or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>PROJECT</th>
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
                            No projects match the search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{p.title}</div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                Owner: {p.ownerName || 'User'}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                              {p.category}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(22, 19, 17, 0.06)',
                                color: 'var(--color-text-main)',
                              }}>
                                {p.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => handleDeleteProject(p)}
                                disabled={actionLoading === `project-${p.id}`}
                                className="btn btn-secondary"
                                style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', color: '#DC2626', borderColor: '#FCA5A5', gap: '4px' }}
                              >
                                {actionLoading === `project-${p.id}` ? (
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
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div>
                <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>REASON</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>TARGET TYPE</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>FILED AT</th>
                        <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 'bold', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsList.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No reports filed. System is clear!
                          </td>
                        </tr>
                      ) : (
                        reportsList.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{r.reason}</div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                Target ID: {r.targetId}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', fontWeight: 'bold' }}>
                              {r.targetType}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 'bold',
                                backgroundColor: r.status === 'PENDING' ? '#FEF2F2' : r.status === 'RESOLVED' ? '#F0FDF4' : 'rgba(22, 19, 17, 0.06)',
                                color: r.status === 'PENDING' ? '#DC2626' : r.status === 'RESOLVED' ? '#166534' : 'var(--color-text-muted)',
                              }}>
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              {r.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => handleDecideReport(r.id, 'RESOLVED')}
                                    disabled={actionLoading === `report-${r.id}`}
                                    className="btn btn-primary"
                                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', backgroundColor: '#166534', borderColor: '#166534', gap: '4px' }}
                                  >
                                    <CheckCircle size={14} /> Resolve
                                  </button>
                                  <button
                                    onClick={() => handleDecideReport(r.id, 'DISMISSED')}
                                    disabled={actionLoading === `report-${r.id}`}
                                    className="btn btn-secondary"
                                    style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)', gap: '4px' }}
                                  >
                                    <XCircle size={14} /> Dismiss
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
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
              </div>
            )}
          </>
        )}
      </div>

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
