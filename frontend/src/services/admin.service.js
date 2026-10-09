import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const adminService = {
  async getStatistics() {
    const response = await apiClient.get(ENDPOINTS.ADMIN_STATS);
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await apiClient.get(ENDPOINTS.ADMIN_USERS, { params });
    return response.data;
  },

  async setUserStatus(userId, status) {
    const response = await apiClient.patch(ENDPOINTS.ADMIN_USER_STATUS(userId), { status });
    return response.data;
  },

  async getProjects(params = {}) {
    const response = await apiClient.get(ENDPOINTS.ADMIN_PROJECTS, { params });
    return response.data;
  },

  async deleteProject(projectId) {
    const response = await apiClient.delete(ENDPOINTS.ADMIN_DELETE_PROJECT(projectId));
    return response.data;
  },

  async getReports(params = {}) {
    const response = await apiClient.get(ENDPOINTS.ADMIN_REPORTS, { params });
    return response.data;
  },

  async decideReport(reportId, status) {
    const response = await apiClient.patch(ENDPOINTS.ADMIN_REPORT_UPDATE(reportId), { status });
    return response.data;
  },
};
