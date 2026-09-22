import { Bell, MapPin, Wifi } from 'lucide-react';

export default function AppHeader({ title, subtitle, rightAction, showLocation = true }) {
  return (
    <header className="app-header">
      <div className="header-status">
        {showLocation ? (
          <div className="location-pill">
            <div className="pulse-dot" />
            <MapPin size={14} />
            <span>Chennai Coast</span>
          </div>
        ) : null}
        <div className="header-icons">
          <span className="network-pill"><Wifi size={14} /> 4G</span>
          <button type="button" className="icon-button" aria-label="Notifications">
            <Bell size={16} />
          </button>
        </div>
      </div>

      {title ? <h1 className="screen-title">{title}</h1> : null}
      {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
      {rightAction ? <div className="header-right-action">{rightAction}</div> : null}
    </header>
  );
}
