import { apiGet } from './api';

export const fetchVictims = async () => {
  try {
    const data = await apiGet('/victims');
    return data;
  } catch (error) {
    return { source: 'api', data: [] };
  }
};
