// API Constants matching docs/api-contract.md
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',

  // Profile & Users
  PROFILE: '/users/profile',
  SEARCH_USERS: '/users/search',

  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  PROJECT_STATUS: (id) => `/projects/${id}/status`,
  PROJECT_BOOKMARK: (id) => `/projects/${id}/bookmark`,
  PROJECT_REQUESTS: (id) => `/projects/${id}/requests`,
  PROJECT_TEAM: (id) => `/projects/${id}/team`,
  PROJECT_TASKS: (id) => `/projects/${id}/tasks`,
  PROJECT_MESSAGES: (id) => `/projects/${id}/messages`,

  // Requests
  UPDATE_REQUEST: (id) => `/requests/${id}`,

  // Tasks
  UPDATE_TASK: (id) => `/tasks/${id}`,
  DELETE_TASK: (id) => `/tasks/${id}`,

  // Showcases
  SHOWCASES: '/showcases',
  SHOWCASE_BY_ID: (id) => `/showcases/${id}`,
  SHOWCASE_LIKE: (id) => `/showcases/${id}/like`,
  SHOWCASE_COMMENTS: (id) => `/showcases/${id}/comments`,

  // Reports
  REPORTS: '/reports',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_STATUS: (id) => `/admin/users/${id}/status`,
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_DELETE_PROJECT: (id) => `/admin/projects/${id}`,
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_REPORT_UPDATE: (id) => `/admin/reports/${id}`,
  ADMIN_STATS: '/admin/statistics',
};
