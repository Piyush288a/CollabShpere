import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const messageService = {
  async getProjectMessages(projectId, params = {}) {
    const response = await apiClient.get(ENDPOINTS.PROJECT_MESSAGES(projectId), { params });
    return response.data; // { results, pagination }
  },

  async sendMessage(projectId, message) {
    const response = await apiClient.post(ENDPOINTS.PROJECT_MESSAGES(projectId), { message });
    return response.data; // { message }
  },
};
