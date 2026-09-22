import { AlertTriangle, ShieldAlert, Siren, CheckCircle2 } from 'lucide-react';

const severityStyle = {
  critical: 'severity-critical',
  high: 'severity-high',
  moderate: 'severity-moderate',
  low: 'severity-low',
};

const iconMap = {
  'flash-flood': AlertTriangle,
  evacuation: ShieldAlert,
  aftershock: Siren,
  landslide: AlertTriangle,
  'all-clear': CheckCircle2,
};

export default function AlertCard({ alert, onMarkRead, onAction }) {
  const Icon = iconMap[alert.type] || AlertTriangle;

  return (
    <article className="alert-card">
      <div className={`alert-severity ${severityStyle[alert.severity] || 'severity-moderate'}`} />
      <div className="alert-main">
        <div className="alert-header-row">
          <div className="alert-icon-wrap">
            <Icon size={16} />
          </div>
          <div>
            <h3>{alert.title}</h3>
            <p>{alert.time}</p>
          </div>
          {!alert.read ? <span className="new-badge">New</span> : null}
        </div>
        <div className="alert-meta">
          <span>{alert.location}</span>
        </div>
        <p className="alert-description">{alert.description}</p>
        <div className="alert-actions">
          <button type="button" className="text-button" onClick={() => onMarkRead?.(alert.id)}>
            {alert.read ? 'Read' : 'Mark as read'}
          </button>
          <button type="button" className="text-button" onClick={() => onAction?.('route')}>
            Safe Route
          </button>
          <button type="button" className="text-button" onClick={() => onAction?.('map')}>
            View on Map
          </button>
        </div>
      </div>
    </article>
  );
}
