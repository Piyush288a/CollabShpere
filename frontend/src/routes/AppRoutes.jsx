import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectDiscoveryPage } from '../pages/ProjectDiscoveryPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { MainLayout } from '../layouts/MainLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Landing Page */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        {/* Guest-only Auth Routes (redirects to /dashboard if logged in) */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Protected Authenticated Application Routes (wrapped in AppLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PROJECTS} element={<ProjectDiscoveryPage />} />
            <Route path={ROUTES.CREATE_PROJECT} element={<CreateProjectPage />} />
            <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          </Route>
        </Route>

        {/* Fallback / Catch-all */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Route>
    </Routes>
  );
};
