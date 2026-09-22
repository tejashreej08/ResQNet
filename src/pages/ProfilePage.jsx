import { ArrowLeft, Bell, ShieldCheck, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell detail-shell">
      <header className="detail-header">
        <button type="button" className="icon-button" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h2>Profile</h2>
      </header>

      <div className="profile-card">
        <div className="profile-header-row">
          <div className="profile-avatar">A</div>
          <div>
            <strong>Aisha Raman</strong>
            <small>Citizen responder</small>
          </div>
        </div>

        <div className="profile-row">
          <span>Location permission</span>
          <span className="status-tag success">Enabled</span>
        </div>

        <div className="profile-row">
          <span>Emergency contacts</span>
          <span>Police, Fire, Medical</span>
        </div>

        <div className="profile-row">
          <span>Notifications</span>
          <span><Bell size={14} /> On</span>
        </div>

        <div className="profile-row">
          <span>Offline mesh</span>
          <span className="status-tag live"><Wifi size={12} /> Active</span>
        </div>

        <div className="profile-row">
          <span>Language</span>
          <span>English</span>
        </div>

        <div className="profile-row">
          <span>Privacy & safety</span>
          <span><ShieldCheck size={14} /> Verified</span>
        </div>
      </div>

      <button type="button" className="logout-button">Reset & Logout</button>
    </div>
  );
}
