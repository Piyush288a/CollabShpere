import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const projectService = {
  async getProjects(params = {}) {
    const response = await apiClient.get(ENDPOINTS.PROJECTS, { params });
    return response.data; // returns { results, pagination }
  },

  async getProjectById(id) {
    const response = await apiClient.get(ENDPOINTS.PROJECT_BY_ID(id));
    return response.data; // returns { project }
  },

  async createProject(projectData) {
    const response = await apiClient.post(ENDPOINTS.PROJECTS, projectData);
    return response.data; // returns { project }
  },
};
