import { apiGet, apiPost } from './api';
import { mockRoutes } from '../data/mockData';

export const fetchRoute = async ({ start = 'N1', end = 'N3' } = {}) => {
  try {
    const data = await apiGet(`/routes?start=${start}&end=${end}`);
    return { source: 'api', data };
  } catch (error) {
    return { source: 'mock', data: mockRoutes, message: 'Mock route data active' };
  }
};

export const rerouteRoute = async ({ start = 'N1', end = 'N3' } = {}) => {
  try {
    return await apiPost('/orchestration/replan', { start, end });
  } catch (error) {
    return {
      message: 'Demo reroute simulation',
      route: mockRoutes,
      source: 'mock',
      generatedAt: new Date().toISOString(),
    };
  }
};
