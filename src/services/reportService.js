import { apiPost } from './api';

const severityMap = {
  Low: 1,
  Moderate: 2,
  Critical: 3,
};

const typeToMedicalNeed = {
  Flooding: 'assistance',
  Earthquake: 'critical',
  Landslide: 'critical',
  Fire: 'critical',
  'Person Trapped': 'critical',
  'Road Blocked': 'assistance',
};

export const submitIncidentReport = async (report) => {
  try {
    const normalizedLocation =
      typeof report.location === 'object' && report.location !== null
        ? report.location
        : {
            lat: 13.05,
            lng: 80.23,
            label: report.location || 'Auto-detected near Chennai Coast',
          };

    const payload = {
      name: report.name || 'Citizen report',
      location: normalizedLocation,
      age: Number(report.age ?? 30),
      medicalNeed: typeToMedicalNeed[report.type] || 'assistance',
      groupSize: Number(report.groupSize ?? 1),
      hazardSeverity: Number(severityMap[report.severity] ?? 2),
      timeSinceContact: Number(report.timeSinceContact ?? 0),
      disasterId: report.disasterId || 'DIS001',
      description: report.description || '',
    };

    const result = await apiPost('/victims', payload);
    return { success: true, ...result, message: 'Incident report submitted successfully.' };
  } catch (error) {
    const message = error?.message || 'Could not submit the report.';
    return {
      success: false,
      message,
    };
  }
};
