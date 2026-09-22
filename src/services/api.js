import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const apiPost = async (url, payload = {}, config = {}) => {
  try {
    const response = await api.post(url, payload, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const apiPatch = async (url, payload = {}, config = {}) => {
  try {
    const response = await api.patch(url, payload, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export default api;
