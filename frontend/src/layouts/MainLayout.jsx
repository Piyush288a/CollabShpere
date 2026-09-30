import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </div>
  );
};
