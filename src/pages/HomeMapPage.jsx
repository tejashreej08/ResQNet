import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, MapPinned, Navigation, Radio, Siren } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/common/AppHeader';
import RiskLegend from '../components/common/RiskLegend';
import BottomNavigation from '../components/layout/BottomNavigation';
import MapView from '../components/map/MapView';
import { fetchDisasters } from '../services/disasterService';
import { fetchSensors } from '../services/sensorService';
import { mockMapZones } from '../data/mockData';

const mapMarkers = [
  { id: 'critical', lat: 12.93, lng: 80.105, color: '#ff5b57', label: 'Critical Zone' },
  { id: 'flood', lat: 12.925, lng: 80.101, color: '#ff9f43', label: 'Flooding' },
  { id: 'victim', lat: 12.94, lng: 80.11, color: '#ffca3a', label: 'Victim' },
  { id: 'center', lat: 12.95, lng: 80.12, color: '#3be7c7', label: 'Emergency Center' },
  { id: 'user', lat: 12.92, lng: 80.095, color: '#67f3ff', label: 'You are here' },
];

export default function HomeMapPage() {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const disasterData = await fetchDisasters();
      const sensorData = await fetchSensors();
      setDisasters(Array.isArray(disasterData) ? disasterData : disasterData.data || []);
      setSensors(sensorData.results || sensorData.data || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const routePositions = useMemo(() => [
    [12.92, 80.095],
    [12.927, 80.1],
    [12.934, 80.104],
    [12.94, 80.11],
    [12.95, 80.12],
  ], []);

  const incidentList = useMemo(() => {
    const entries = disasters.map((incident, index) => ({
      id: incident.id || `${incident.name || 'disaster'}-${index}`,
      title: incident.name || 'Disaster Zone',
      detail: incident.location || 'North Harbor District',
      severity: incident.severity || 'High',
      status: incident.status || 'Active',
    }));

    if (!entries.length) {
      return [
        { id: 'flood', title: 'Flooding', detail: 'Harbor Ave • 2.1 km', severity: 'High', status: 'Active' },
        { id: 'fire', title: 'Power Lines', detail: 'Lark Street • 1.3 km', severity: 'Moderate', status: 'Monitoring' },
        { id: 'rescue', title: 'Rescue Team', detail: 'Emergency Center • 0.8 km', severity: 'Low', status: 'On route' },
      ];
    }

    return entries;
  }, [disasters]);

  return (
    <div className="app-shell map-shell-page">
      <AppHeader
        title="FLOOD ALERT ACTIVE"
        subtitle="Chennai Coast • Live Risk Map"
        showLocation
      />

      <div className="map-header-actions">
        <button type="button" className={`pill-button ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
          Map
        </button>
        <button type="button" className={`pill-button ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          List
        </button>
      </div>

      {view === 'map' ? (
        <>
          <div className="risk-map-panel">
            {loading ? (
              <div className="map-surface loading-surface">Loading live map...</div>
            ) : (
              <MapView
                zones={mockMapZones.concat(sensors.map((sensor) => ({
                  id: sensor.sensorId || sensor.id,
                  type: sensor.status === 'critical' ? 'critical' : sensor.status === 'warning' ? 'moderate' : 'safe',
                  name: 'Sensor Zone',
                  lat: sensor.location?.lat || 12.93,
                  lng: sensor.location?.lng || 80.11,
                  radius: 220,
                })))}
                markers={mapMarkers}
                route={routePositions}
                showRoute
              />
            )}
          </div>

          <RiskLegend />
        </>
      ) : (
        <div className="alert-list" style={{ marginTop: '12px' }}>
          {incidentList.map((incident) => (
            <div key={incident.id} className="alert-card">
              <div className={`alert-severity ${incident.severity === 'High' ? 'severity-critical' : incident.severity === 'Moderate' ? 'severity-high' : 'severity-low'}`} />
              <div className="alert-main">
                <div className="alert-header-row">
                  <div className="alert-icon-wrap">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <h3>{incident.title}</h3>
                    <p>{incident.detail}</p>
                  </div>
                  <span className="new-badge">{incident.status}</span>
                </div>
                <div className="alert-meta">Severity: {incident.severity}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="map-quick-actions">
        <button type="button" className="emergency-action red" onClick={() => navigate('/sos')}>
          <Siren size={18} />
          SOS
        </button>
        <button type="button" className="emergency-action teal" onClick={() => navigate('/route')}>
          <Navigation size={18} />
          Safe Route
        </button>
        <button type="button" className="emergency-action neutral" onClick={() => navigate('/report')}>
          <MapPinned size={18} />
          Report
        </button>
      </div>

      <div className="mini-alert-card">
        <AlertTriangle size={16} />
        <div>
          <strong>{disasters[0]?.location || 'Synthetic Zone A'}</strong>
          <span>{disasters[0]?.severity || 'High'} risk • {sensors.length || 2} sensors active</span>
        </div>
        <Radio size={16} className="signal-icon" />
      </div>

      <BottomNavigation />
    </div>
  );
}
