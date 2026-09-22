export default function RouteStepCard({ step, direction, street, distance, time, status, isActive = false }) {
  return (
    <div className={`route-step-card ${status === 'blocked' ? 'blocked' : ''} ${isActive ? 'active' : ''}`}>
      <div className="route-step-number">{step}</div>
      <div className="route-step-copy">
        <div className="route-step-topline">
          <span>{direction}</span>
          <span className={status === 'blocked' ? 'status-chip blocked' : 'status-chip safe'}>{status === 'blocked' ? 'Blocked' : isActive ? 'Now' : 'Safe'}</span>
        </div>
        <p>{street}</p>
      </div>
      <div className="route-step-metrics">
        <span>{distance}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
