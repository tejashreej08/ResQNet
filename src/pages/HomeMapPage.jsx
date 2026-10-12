import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, MapPinned, Navigation, Radio, Siren } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/common/AppHeader';
import RiskLegend from '../components/common/RiskLegend';
import BottomNavigation from '../components/layout/BottomNavigation';
import MapView from '../components/map/MapView';
import { fetchDisasters } from '../services/disasterService';
import { fetchSensors } from '../services/sensorService';
import { fetchVictims } from '../services/victimService';

const mapMarkers = [];

export default function HomeMapPage() {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [disasterData, sensorData, victimData] = await Promise.all([
        fetchDisasters(),
        fetchSensors(),
        fetchVictims(),
      ]);

      setDisasters(Array.isArray(disasterData) ? disasterData : disasterData.data || []);
      setSensors(sensorData.results || sensorData.data || []);
      setVictims(Array.isArray(victimData) ? victimData : victimData.data || []);
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

  const mapZones = useMemo(() => {
    const disasterZones = disasters.map((disaster, index) => ({
      id: `disaster-zone-${disaster.id || index + 1}`,
      type: (disaster.severity || 'High').toLowerCase().includes('critical') ? 'critical' : (disaster.severity || 'High').toLowerCase().includes('moderate') ? 'moderate' : 'flood',
      name: disaster.name || disaster.zone || 'Disaster Zone',
      lat: Number(disaster.coordinates?.lat ?? disaster.location?.lat ?? 12.93 + index * 0.01),
      lng: Number(disaster.coordinates?.lng ?? disaster.location?.lng ?? 80.11 + index * 0.01),
      radius: 260 + index * 60,
    }));

    const sensorZones = (sensors || []).map((sensor, index) => ({
      id: `sensor-zone-${sensor.sensorId || sensor.id || index + 1}`,
      type: sensor.status === 'critical' ? 'critical' : sensor.status === 'warning' ? 'moderate' : 'safe',
      name: 'Sensor Zone',
      lat: Number(sensor.location?.lat ?? 12.93 + index * 0.005),
      lng: Number(sensor.location?.lng ?? 80.11 + index * 0.005),
      radius: 180,
    }));

    return [...disasterZones, ...sensorZones];
  }, [disasters, sensors]);

  const victimMarkers = useMemo(() => (
    (victims || []).map((victim, index) => ({
      id: `victim-marker-${victim.id || index + 1}`,
      lat: Number(victim.location?.lat ?? victim.location?.coordinates?.lat ?? 12.93 + index * 0.003),
      lng: Number(victim.location?.lng ?? victim.location?.coordinates?.lng ?? 80.11 + index * 0.003),
      color: '#ffca3a',
      label: victim.name || 'Submitted report',
    }))
  ), [victims]);

  const incidentList = useMemo(() => {
    const entries = [
      ...disasters.map((incident, index) => ({
        id: `disaster-entry-${incident.id || index + 1}`,
        title: incident.name || 'Disaster Zone',
        detail: incident.location || 'North Harbor District',
        severity: incident.severity || 'High',
        status: incident.status || 'Active',
      })),
      ...victims.map((victim, index) => ({
        id: `victim-entry-${victim.id || index + 1}`,
        title: victim.name || 'Citizen Report',
        detail: typeof victim.location === 'string' ? victim.location : `${victim.location?.lat ?? ''}, ${victim.location?.lng ?? ''}`,
        severity: victim.medicalNeed || 'Moderate',
        status: victim.status || 'Waiting',
      })),
    ];

    return entries;
  }, [disasters, victims]);

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
                zones={mapZones}
                markers={[...mapMarkers, ...victimMarkers]}
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
          <strong>{disasters[0]?.name || disasters[0]?.zone || 'No active disaster zone'}</strong>
          <span>{disasters[0]?.severity || 'Live'} risk • {sensors.length || 0} sensors active</span>
        </div>
        <Radio size={16} className="signal-icon" />
      </div>

      <BottomNavigation />
    </div>
  );
}
