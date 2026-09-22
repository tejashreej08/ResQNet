import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BellDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AlertCard from '../components/alerts/AlertCard';
import { mockAlerts } from '../data/mockData';

const tabs = ['All', 'Critical', 'Unread'];

export default function AlertFeedPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [alerts, setAlerts] = useState(mockAlerts);

  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((current) => {
        if (current.length >= 6) return current;
        return [
          {
            id: `A${current.length + 1}`,
            type: 'flash-flood',
            title: 'Flash Flood Warning',
            description: 'Water level update from nearby river sensors.',
            severity: 'critical',
            location: 'Zone A – Riverside',
            time: 'Just now',
            read: false,
            action: 'safe-route',
          },
          ...current,
        ];
      });
    }, 18000);

    return () => clearInterval(timer);
  }, []);

  const filteredAlerts = useMemo(() => {
    if (activeTab === 'Critical') return alerts.filter((alert) => alert.severity === 'critical' || alert.severity === 'high');
    if (activeTab === 'Unread') return alerts.filter((alert) => !alert.read);
    return alerts;
  }, [activeTab, alerts]);

  const markRead = (alertId) => {
    setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)));
  };

  return (
    <div className="app-shell detail-shell">
      <header className="detail-header feed-header">
        <button type="button" className="icon-button" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>Alert Feed</h2>
          <p>Chennai Coast • Live updates</p>
        </div>
        <div className="alert-icon-wrap small-notif"><BellDot size={18} /></div>
      </header>

      <div className="feed-meta-row">
        <span className="status-tag live">Live updates</span>
        <span className="status-tag subtle">Updated 12s ago</span>
        <span className="new-badge">New</span>
      </div>

      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-tab ${activeTab === tab ? 'selected' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="alert-list">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} onAction={() => navigate('/route')} />
        ))}
      </div>
    </div>
  );
}
