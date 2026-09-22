import { useEffect, useState } from 'react';
import { ArrowLeft, Navigation, Route, TimerReset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import RouteStepCard from '../components/routes/RouteStepCard';
import { fetchRoute, rerouteRoute } from '../services/routeService';
import { mockMapZones } from '../data/mockData';

export default function SafeRoutePage() {
  const navigate = useNavigate();
  const [routeSteps, setRouteSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskScore, setRiskScore] = useState(87);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const loadRoute = async () => {
      setLoading(true);
      const result = await fetchRoute({ start: 'N1', end: 'N3' });
      const normalizedSteps = (result.data || []).map((step, index) => ({
        step: index + 1,
        direction: step.direction || (index === 0 ? 'Head north' : 'Continue'),
        street: step.street || `Street ${index + 1}`,
        distance: `${step.distance || 0.8} km`,
        time: `${step.travelTime || 4} min`,
        status: step.status || 'safe',
      }));
      setRouteSteps(normalizedSteps.length ? normalizedSteps : [
        { step: 1, direction: 'Head north', street: 'Harbor Ave', distance: '0.5 km', time: '2 min', status: 'safe' },
        { step: 2, direction: 'Turn left', street: 'Lark Street', distance: '0.8 km', time: '4 min', status: 'safe' },
        { step: 3, direction: 'Avoid flood zone', street: 'Bridge Road', distance: '1.1 km', time: '6 min', status: 'blocked' },
      ]);
      setLoading(false);
    };

    loadRoute();
  }, []);

  const handleReroute = async () => {
    setLoading(true);
    const result = await rerouteRoute({ start: 'N1', end: 'N3' });
    if (result?.route) {
      setRouteSteps(result.route);
      setCurrentStepIndex(0);
      setRiskScore(91);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isNavigating || routeSteps.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        const nextIndex = prevIndex >= routeSteps.length - 1 ? prevIndex : prevIndex + 1;

        if (nextIndex >= routeSteps.length - 1) {
          setIsNavigating(false);
        }

        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isNavigating, routeSteps.length]);

  const activeStep = routeSteps[currentStepIndex] || routeSteps[0] || {
    direction: 'Head north',
    street: 'Harbor Ave',
    distance: '0.5 km',
    time: '2 min',
  };

  return (
    <div className="app-shell detail-shell">
      <header className="detail-header">
        <button type="button" className="icon-button" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div className="route-header-copy">
          <h2>City Shelter</h2>
          <p>North Harbor District</p>
        </div>
        <button type="button" className="small-action-button" onClick={handleReroute}>Reroute</button>
      </header>

      <div className="route-summary-row">
        <div>
          <span className="route-time">14 min</span>
          <small>Estimated time</small>
        </div>
        <div>
          <span className="route-distance">2.6 km</span>
          <small>Distance</small>
        </div>
      </div>

      <div className="map-panel route-map-panel">
        <MapView showRoute zones={mockMapZones} markers={[{ id: 'route-user', lat: 12.92, lng: 80.095, color: '#67f3ff', label: 'You' }, { id: 'route-shelter', lat: 12.95, lng: 80.12, color: '#3be7c7', label: 'Shelter' }]} route={[[12.92,80.095],[12.93,80.101],[12.94,80.11],[12.95,80.12]]} />
      </div>

      <div className="route-badges">
        <div className="score-card">
          <span>Route safety score</span>
          <strong>{riskScore} / 100</strong>
        </div>
        <div className="status-tag success">Status: Active</div>
      </div>

      <div className="route-warnings-row">
        <div className="warning-box">Flood risk on Bridge Road</div>
        <div className="warning-box success">Alternate route is safe</div>
      </div>

      <div className="status-banner warning" style={{ marginTop: '18px' }}>
        <Navigation size={16} />
        {isNavigating
          ? `Next: ${activeStep.direction} • ${activeStep.street}`
          : 'Tap start to begin live route guidance'}
      </div>

      <div className="route-list">
        {loading ? <p>Updating safest route...</p> : routeSteps.map((step, index) => (
          <RouteStepCard key={`${step.step}-${step.street}`} {...step} isActive={isNavigating && index === currentStepIndex} />
        ))}
      </div>

      <button type="button" className="primary-button full-width-button" onClick={() => setIsNavigating((prev) => !prev)}>
        <Navigation size={18} />
        {isNavigating ? 'End Navigation' : 'Start Navigation'}
      </button>
    </div>
  );
}
