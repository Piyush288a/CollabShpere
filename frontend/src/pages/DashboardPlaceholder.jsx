import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';
import { Rocket, LogOut, CheckCircle2, User, Shield, Radio, ArrowLeft } from 'lucide-react';
import '../styles/global.css';

export const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)',
      color: 'var(--color-text-main)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Simple Authenticated Header Bar */}
      <header style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 var(--space-xl)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to={ROUTES.HOME} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-extrabold)',
          color: 'var(--color-text-main)',
        }}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Rocket size={16} />
          </span>
          CollabSphere
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-xs)',
            backgroundColor: 'var(--color-bg-primary)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border-subtle)',
          }}>
            <User size={14} color="var(--color-accent)" />
            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.85rem', fontSize: 'var(--font-size-xs)' }}
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{
        flex: 1,
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="card" style={{
          maxWidth: '600px',
          width: '100%',
          padding: 'var(--space-3xl)',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <CheckCircle2 size={32} />
          </div>

          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-xs)' }}>
            Authentication Verified
          </h1>

          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
            Welcome back, <strong style={{ color: 'var(--color-text-main)' }}>{user?.name}</strong>! You have logged in successfully.
          </p>

          {/* Session Details Card */}
          <div style={{
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Email:</span>
              <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Role:</span>
              <span className="badge" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{user?.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Account Status:</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Socket.IO Client Status:</span>
              <span style={{ color: socket?.connected ? 'var(--color-success)' : 'var(--color-text-subtle)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Radio size={14} color={socket?.connected ? 'var(--color-success)' : 'var(--color-text-subtle)'} />
                {socket?.connected ? 'Connected (Authenticated Handshake)' : 'Ready'}
              </span>
            </div>
          </div>

          <div style={{
            padding: 'var(--space-md)',
            backgroundColor: 'rgba(255, 90, 54, 0.06)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-accent-border)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-xl)',
          }}>
            ℹ️ <strong>Phase 12 Complete</strong>: Authentication UI, token persistence, and route protection are fully operational. Application dashboards, project management, and chat UI will be implemented in subsequent phases.
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <Link to={ROUTES.HOME} className="btn btn-secondary">
              <ArrowLeft size={16} />
              Return to Landing Page
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
