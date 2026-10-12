import { apiGet } from './api';

export const fetchDisasters = async () => {
  try {
    const data = await apiGet('/disasters');
    return data;
  } catch (error) {
    return { data: [], message: 'Live disaster data unavailable.' };
  }
};

export const fetchAlerts = async () => {
  try {
    const [disasterData, victimData] = await Promise.all([
      apiGet('/disasters'),
      apiGet('/victims'),
    ]);

    const disasterAlerts = Array.isArray(disasterData)
      ? disasterData.map((item, index) => {
          const severity = String(item.severity || 'High');
          const title = item.name || `Disaster Alert ${index + 1}`;
          const location = item.zone || item.location || 'Chennai Coast';
          const time = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            : 'Just now';

          return {
            id: `disaster-${item.id || index + 1}`,
            type: item.type || 'flash-flood',
            title,
            description: `${title} is active near ${location}. Current severity is ${severity}.`,
            severity: severity.toLowerCase(),
            location,
            time,
            read: false,
            action: 'route',
          };
        })
      : [];

    const victimAlerts = Array.isArray(victimData)
      ? victimData.map((item, index) => {
          const severity = String(item.medicalNeed || item.hazardSeverity || 'moderate');
          const title = item.name || `Citizen Report ${index + 1}`;
          const location = typeof item.location === 'string'
            ? item.location
            : item.location?.label || 'Chennai Coast';
          const time = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            : 'Just now';

          return {
            id: `victim-${item.id || index + 1}`,
            type: 'citizen-report',
            title,
            description: `${title} reported an incident near ${location}. Current priority is ${severity}.`,
            severity: severity.toLowerCase(),
            location,
            time,
            read: false,
            action: 'report',
          };
        })
      : [];

    return { source: 'api', data: [...disasterAlerts, ...victimAlerts] };
  } catch (error) {
    return { source: 'api', data: [], message: 'Live alert feed unavailable.' };
  }
};
