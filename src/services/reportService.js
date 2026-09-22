import { apiPost } from './api';

export const submitIncidentReport = async (report) => {
  try {
    return await apiPost('/victims', {
      name: report.name || 'Citizen report',
      location: report.location || 'Auto-detected',
      age: 30,
      medicalNeed: report.type || 'assistance',
      groupSize: 1,
      hazardSeverity: report.severity || 'moderate',
      timeSinceContact: '0h',
      disasterId: report.disasterId || 'DIS001',
      description: report.description || '',
    });
  } catch (error) {
    return {
      message: 'Demo mode: incident report stored locally only',
      source: 'mock',
      success: true,
      __demo: true,
    };
  }
};
