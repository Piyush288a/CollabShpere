import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const collaborationService = {
  // POST /api/projects/:id/requests — send a request to join an OPEN project
  async createRequest(projectId, message = '') {
    const response = await apiClient.post(ENDPOINTS.PROJECT_REQUESTS(projectId), { message });
    return response.data; // returns { request }
  },

  // GET /api/projects/:id/requests — owner lists incoming requests (supports optional status filter)
  async getProjectRequests(projectId, params = {}) {
    const response = await apiClient.get(ENDPOINTS.PROJECT_REQUESTS(projectId), { params });
    return response.data; // returns { results, pagination }
  },

  // PATCH /api/requests/:id — owner accepts or rejects a pending request ({ status: 'ACCEPTED' | 'REJECTED' })
  async decideRequest(requestId, status) {
    const response = await apiClient.patch(ENDPOINTS.UPDATE_REQUEST(requestId), { status });
    return response.data; // returns { request }
  },

  // GET /api/projects/:id/team — retrieve team members for a project
  async getProjectTeam(projectId) {
    const response = await apiClient.get(ENDPOINTS.PROJECT_TEAM(projectId));
    return response.data; // returns { projectId, ownerId, members }
  },
};
