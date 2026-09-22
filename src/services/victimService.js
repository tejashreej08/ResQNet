import { apiGet } from './api';
import { mockVictims } from '../data/mockData';

export const fetchVictims = async () => {
  try {
    const data = await apiGet('/victims');
    return data;
  } catch (error) {
    return { source: 'mock', data: mockVictims };
  }
};
