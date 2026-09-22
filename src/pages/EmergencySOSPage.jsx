import { useState } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, Siren } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmergencySOSButton from '../components/sos/EmergencySOSButton';
import StatusBanner from '../components/common/StatusBanner';

const contacts = [
  { label: 'Police', phone: '100' },
  { label: 'Fire Department', phone: '101' },
  { label: 'Medical', phone: '108' },
];

export default function EmergencySOSPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSosTrigger = async () => {
    setStatus('loading');
    setMessage('Sending emergency request...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus('success');
      setMessage('SOS request prepared and routed via mesh network relay. Demo only — no real emergency authority was contacted.');
    } catch (error) {
      setStatus('error');
      setMessage('Unable to send SOS in this demo environment. Please retry or contact local responders manually.');
    }
  };

  return (
    <div className="app-shell detail-shell">
      <header className="detail-header">
        <button type="button" className="icon-button" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h2>Emergency SOS</h2>
      </header>

      <div className="location-summary">
        <div>
          <MapPin size={14} />
          <span>Current GPS: Chennai Coast • 12.924°N, 80.101°E</span>
        </div>
        <span className="gps-status">GPS Stable</span>
      </div>

      <StatusBanner tone="warning">
        Mesh Network Active — sending via peer relay
      </StatusBanner>

      <div className="sos-panel">
        <EmergencySOSButton onTrigger={handleSosTrigger} />
        {status !== 'idle' ? (
          <div className={`feedback-box ${status}`}>
            {status === 'success' ? <ShieldCheck size={16} /> : <Siren size={16} />}
            <span>{message}</span>
          </div>
        ) : null}
      </div>

      <p className="supporting-text">
        ResQNet may share your GPS, select emergency contacts, photos, and location notes with nearby responders.
      </p>

      <div className="contact-grid">
        {contacts.map((contact) => (
          <button key={contact.label} type="button" className="contact-button">
            {contact.label}
            <span>{contact.phone}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
