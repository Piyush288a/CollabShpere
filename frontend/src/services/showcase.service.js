import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const showcaseService = {
  // GET /api/showcases — list showcases with pagination
  async getShowcases(params = {}) {
    const response = await apiClient.get(ENDPOINTS.SHOWCASES, { params });
    return response.data; // { results, pagination }
  },

  // GET /api/showcases/:id — single showcase detail
  async getShowcaseById(id) {
    const response = await apiClient.get(ENDPOINTS.SHOWCASE_BY_ID(id));
    return response.data; // { showcase }
  },

  // POST /api/showcases — publish showcase for a completed project
  async publishShowcase(showcaseData) {
    const response = await apiClient.post(ENDPOINTS.SHOWCASES, showcaseData);
    return response.data; // { showcase }
  },

  // POST /api/showcases/:id/like — like showcase
  async likeShowcase(id) {
    const response = await apiClient.post(ENDPOINTS.SHOWCASE_LIKE(id));
    return response.data; // { showcase }
  },

  // DELETE /api/showcases/:id/like — unlike showcase
  async unlikeShowcase(id) {
    const response = await apiClient.delete(ENDPOINTS.SHOWCASE_LIKE(id));
    return response.data; // { showcase }
  },

  // GET /api/showcases/:id/comments — list comments
  async getComments(id, params = {}) {
    const response = await apiClient.get(ENDPOINTS.SHOWCASE_COMMENTS(id), { params });
    return response.data; // { results, pagination }
  },

  // POST /api/showcases/:id/comments — add a comment
  async addComment(id, text) {
    const response = await apiClient.post(ENDPOINTS.SHOWCASE_COMMENTS(id), { text });
    return response.data; // { comment }
  },
};
