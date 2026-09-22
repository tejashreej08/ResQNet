import { apiGet } from './api';
import { mockAlerts } from '../data/mockData';

export const fetchDisasters = async () => {
  try {
    const data = await apiGet('/disasters');
    return data;
  } catch (error) {
    return { isDemo: true, source: 'mock', data: [{ id: 'DIS001', type: 'flood', location: 'Synthetic Zone A', severity: 'high', status: 'active' }], message: 'Backend unavailable — using demo data' };
  }
};

export const fetchAlerts = async () => {
  try {
    const data = await apiGet('/disasters');
    return { source: 'api', data: Array.isArray(data) ? data : mockAlerts };
  } catch (error) {
    return { source: 'mock', data: mockAlerts, message: 'Mock alert feed active' };
  }
};
