export const mockAlerts = [
  {
    id: 'A1',
    type: 'flash-flood',
    title: 'Flash Flood Warning',
    description: 'Water levels are rising fast near the river delta and low-lying streets.',
    severity: 'critical',
    location: 'Zone A – Riverside',
    time: '2 min ago',
    read: false,
    action: 'safe-route',
  },
  {
    id: 'A2',
    type: 'evacuation',
    title: 'Evacuation Order',
    description: 'Residents in the east grid should move to the nearest shelter immediately.',
    severity: 'high',
    location: 'Zone B – East Grid',
    time: '9 min ago',
    read: false,
    action: 'map',
  },
  {
    id: 'A3',
    type: 'aftershock',
    title: 'Aftershock Detected',
    description: 'Seismic activity remains above threshold after the main quake.',
    severity: 'moderate',
    location: 'Zone C – Hill View',
    time: '18 min ago',
    read: true,
    action: 'map',
  },
  {
    id: 'A4',
    type: 'landslide',
    title: 'Landslide Risk',
    description: 'Slope monitoring indicates movement near the north access road.',
    severity: 'high',
    location: 'Zone D – North Ridge',
    time: '26 min ago',
    read: true,
    action: 'route',
  },
  {
    id: 'A5',
    type: 'all-clear',
    title: 'All Clear',
    description: 'Conditions in the central district have stabilized for now.',
    severity: 'low',
    location: 'Central District',
    time: '40 min ago',
    read: true,
    action: 'map',
  },
];

export const mockRoutes = [
  { step: 1, direction: 'Head north', street: 'Harbor Ave', distance: '0.5 km', time: '2 min', status: 'safe' },
  { step: 2, direction: 'Turn left', street: 'Lark Street', distance: '0.8 km', time: '4 min', status: 'safe' },
  { step: 3, direction: 'Avoid flood zone', street: 'Bridge Road', distance: '1.1 km', time: '6 min', status: 'blocked' },
  { step: 4, direction: 'Continue east', street: 'Civic Center Blvd', distance: '0.9 km', time: '3 min', status: 'safe' },
];

export const mockMapZones = [
  { id: 'critical-1', type: 'critical', name: 'Critical Zone', lat: 12.93, lng: 80.105, radius: 350 },
  { id: 'flood-1', type: 'flood', name: 'Flooding', lat: 12.925, lng: 80.101, radius: 280 },
  { id: 'safe-1', type: 'safe', name: 'Safe', lat: 12.95, lng: 80.12, radius: 240 },
  { id: 'risk-1', type: 'moderate', name: 'Moderate Risk', lat: 12.94, lng: 80.11, radius: 300 },
];

export const mockVictims = [
  { id: 'V001', name: 'Nisha', location: '12.93, 80.10', hazardSeverity: 'critical', status: 'waiting' },
  { id: 'V002', name: 'Manoj', location: '12.95, 80.12', hazardSeverity: 'high', status: 'waiting' },
];

export const mockTeams = [
  { id: 'T001', name: 'Alpha Rescue', status: 'available' },
  { id: 'T002', name: 'Medical Unit', status: 'busy' },
];

export const defaultRiskLegend = [
  { label: 'Critical', color: '#ff5b57' },
  { label: 'High', color: '#ff9f43' },
  { label: 'Moderate', color: '#f6d365' },
  { label: 'Safe', color: '#3be7c7' },
];
