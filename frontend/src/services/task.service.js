import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const taskService = {
  async getProjectTasks(projectId, params = {}) {
    const response = await apiClient.get(ENDPOINTS.PROJECT_TASKS(projectId), { params });
    return response.data; // { results, pagination }
  },

  async createTask(projectId, taskData) {
    const response = await apiClient.post(ENDPOINTS.PROJECT_TASKS(projectId), taskData);
    return response.data; // { task }
  },

  async updateTask(taskId, updateData) {
    const response = await apiClient.patch(ENDPOINTS.UPDATE_TASK(taskId), updateData);
    return response.data; // { task }
  },

  async deleteTask(taskId) {
    const response = await apiClient.delete(ENDPOINTS.DELETE_TASK(taskId));
    return response.data; // { message, id }
  },
};
