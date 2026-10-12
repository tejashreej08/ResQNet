import { apiGet } from './api';

export const fetchSensors = async () => {
  try {
    const data = await apiGet('/sensors');
    return data;
  } catch (error) {
    return {
      generatedAt: new Date().toISOString(),
      results: [],
      source: 'api',
    };
  }
};
