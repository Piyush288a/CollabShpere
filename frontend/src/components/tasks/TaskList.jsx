import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/task.service';
import { collaborationService } from '../../services/collaboration.service';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskSkeleton } from './TaskSkeleton';
import { Plus, CheckSquare, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import '../../styles/global.css';

export const TaskList = ({ projectId, isOwner }) => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadTasksAndTeam = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const [tasksRes, teamRes] = await Promise.all([
        taskService.getProjectTasks(projectId, params),
        collaborationService.getProjectTeam(projectId).catch(() => ({ members: [] })),
      ]);

      setTasks(tasksRes.results || []);
      setTeamMembers(teamRes.members || []);
    } catch (err) {
      console.error('Failed to load project tasks:', err);
      setError(err.message || 'Unable to load tasks for this workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadTasksAndTeam();
    }
  }, [projectId, statusFilter]);

  const handleCreateTask = async (taskPayload) => {
    setActionError(null);
    try {
      await taskService.createTask(projectId, taskPayload);
      await loadTasksAndTeam();
    } catch (err) {
      setActionError(err.message || 'Failed to create task.');
      throw err;
    }
  };

  const handleUpdateStatus = async (taskId, nextStatus) => {
    setActionError(null);
    try {
      await taskService.updateTask(taskId, { status: nextStatus });
      await loadTasksAndTeam();
    } catch (err) {
      console.error('Failed to update task status:', err);
      setActionError(err.message || 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionError(null);
    try {
      await taskService.deleteTask(taskId);
      await loadTasksAndTeam();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setActionError(err.message || 'Failed to delete task.');
    }
  };

  // Counts for summary
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Top Action & Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'TODO', label: `To Do (${statusFilter === 'ALL' ? todoCount : statusFilter === 'TODO' ? tasks.length : 0})` },
            { id: 'IN_PROGRESS', label: `In Progress (${statusFilter === 'ALL' ? inProgressCount : statusFilter === 'IN_PROGRESS' ? tasks.length : 0})` },
            { id: 'COMPLETED', label: `Completed (${statusFilter === 'ALL' ? completedCount : statusFilter === 'COMPLETED' ? tasks.length : 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: statusFilter === tab.id ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: statusFilter === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: statusFilter === tab.id ? 'var(--color-accent-soft)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            onClick={loadTasksAndTeam}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: 'var(--font-size-xs)' }}
            title="Refresh tasks"
          >
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          </button>

          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: 'var(--font-size-xs)', gap: '4px' }}
          >
            <Plus size={15} />
            Create Task
          </button>
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
        }}>
          <AlertCircle size={16} />
          {actionError}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <TaskSkeleton />
      ) : error ? (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: 'var(--space-xl)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
        }}>
          <AlertCircle size={24} style={{ marginBottom: 'var(--space-xs)' }} />
          <div>{error}</div>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4xl) var(--space-xl)',
          textAlign: 'center',
        }}>
          <CheckSquare size={44} color="var(--color-text-subtle)" style={{ marginBottom: 'var(--space-md)' }} />
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
            No tasks found
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto var(--space-lg)' }}>
            {statusFilter === 'ALL'
              ? 'There are no active tasks in this workspace. Create your first task to start tracking team progress!'
              : `No tasks currently match the "${statusFilter.replace('_', ' ')}" status filter.`}
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            Create First Task
          </button>
        </div>
      ) : (
        /* Task Cards Grid */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              teamMembers={teamMembers}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Creation Form Modal */}
      {isFormOpen && (
        <TaskForm
          teamMembers={teamMembers}
          onSubmit={handleCreateTask}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};
