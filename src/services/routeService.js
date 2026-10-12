import { apiGet, apiPost } from './api';

export const fetchRoute = async ({ start = 'N1', end = 'N3' } = {}) => {
  try {
    const data = await apiGet(`/routes?start=${start}&end=${end}`);
    return { source: 'api', data };
  } catch (error) {
    return { source: 'api', data: [], message: 'Live route data unavailable.' };
  }
};

export const rerouteRoute = async ({ start = 'N1', end = 'N3' } = {}) => {
  try {
    return await apiPost('/orchestration/replan', { start, end });
  } catch (error) {
    return {
      message: 'Live reroute unavailable.',
      route: [],
      source: 'api',
      generatedAt: new Date().toISOString(),
    };
  }
};
