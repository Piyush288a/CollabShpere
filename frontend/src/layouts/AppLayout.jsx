import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';

export const AppLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <AppHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
