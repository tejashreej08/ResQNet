import { apiGet } from './api';

export const fetchSensors = async () => {
  try {
    const data = await apiGet('/sensors');
    return data;
  } catch (error) {
    return {
      generatedAt: new Date().toISOString(),
      results: [
        { sensorId: 'S001', disasterId: 'DIS001', location: { lat: 12.925, lng: 80.101 }, status: 'critical', severity: 'critical' },
        { sensorId: 'S002', disasterId: 'DIS001', location: { lat: 12.94, lng: 80.11 }, status: 'warning', severity: 'warning' },
      ],
      source: 'mock',
    };
  }
};
