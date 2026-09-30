import apiClient from './api.client';
import { ENDPOINTS } from '../constants/api.constants';

export const authService = {
  async register(name, email, password) {
    const response = await apiClient.post(ENDPOINTS.REGISTER, { name, email, password });
    return response.data; // returns { token, user }
  },

  async login(email, password) {
    const response = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
    return response.data; // returns { token, user }
  },

  async getProfile() {
    const response = await apiClient.get(ENDPOINTS.PROFILE);
    return response.data; // returns { user }
  },

  async updateProfile(profileData) {
    const response = await apiClient.put(ENDPOINTS.PROFILE, profileData);
    return response.data; // returns updated user
  },
};
