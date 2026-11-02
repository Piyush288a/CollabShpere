import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/task.service';
import { collaborationService } from '../../services/collaboration.service';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskSkeleton } from './TaskSkeleton';
import { Plus, CheckSquare, RefreshCw, AlertCircle, Sparkles, Filter, Terminal, Cpu } from 'lucide-react';
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
      {/* Action Error Banner */}
      {actionError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#f87171',
          fontSize: 'var(--font-size-sm)',
        }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Cyber Task Control Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        backgroundColor: 'rgba(14, 18, 28, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Filter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: '6px',
          }}>
            <Cpu size={14} /> FILTER:
          </span>

          {[
            { id: 'ALL', label: 'ALL DIRECTIVES', count: tasks.length },
            { id: 'TODO', label: 'QUEUED', count: todoCount },
            { id: 'IN_PROGRESS', label: 'RUNNING', count: inProgressCount },
            { id: 'COMPLETED', label: 'EXECUTED', count: completedCount },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: isSelected ? '1px solid var(--color-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(22, 29, 45, 0.5)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  backgroundColor: isSelected ? 'var(--color-cyan)' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#000000' : 'var(--color-text-subtle)',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deploy Directive Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          <span>NEW DIRECTIVE</span>
        </button>
      </div>

      {/* Task Cards Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : error ? (
        <div style={{
          padding: 'var(--space-3xl)',
          textAlign: 'center',
          backgroundColor: 'rgba(22, 29, 45, 0.6)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <AlertCircle size={32} color="#f87171" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#FFFFFF', marginBottom: '6px' }}>Execution Error</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>{error}</p>
          <button onClick={loadTasksAndTeam} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
            <RefreshCw size={14} /> Retry Query
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div style={{
          padding: 'var(--space-4xl)',
          textAlign: 'center',
          backgroundColor: 'rgba(22, 29, 45, 0.4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cyan)',
            margin: '0 auto 16px',
          }}>
            <Terminal size={26} />
          </div>
          <h4 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>
            Zero Directives Active
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '420px', margin: '0 auto 20px' }}>
            No task protocols currently queued for this filter state. Create a directive to divide work among teammates.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: 'var(--font-size-xs)' }}
          >
            <Plus size={16} /> Deploy Directive
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
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

      {/* Task Creation Modal */}
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
