import { ArrowRight, RadioTower, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell welcome-shell">
      <div className="top-network-bar">
        <div className="signal-mini">
          <RadioTower size={12} />
          <span>Connected</span>
        </div>
      </div>

      <div className="brand-block">
        <div className="brand-mark">
          <ShieldCheck size={24} />
        </div>
        <div className="brand-copy">
          <span className="mini-tag">AI-Powered Rescue Network</span>
        </div>
      </div>

      <div className="location-glow-wrap">
        <div className="location-glow-ring">
          <div className="location-glow-core" />
        </div>
      </div>

      <div className="welcome-copy">
        <h1>Stay safe.<br />Stay connected.</h1>
        <p>
          ResQNet uses real-time AI to guide citizens during floods, earthquakes, and landslides,
          even without internet in future versions.
        </p>
      </div>

      <button type="button" className="primary-button full-width-button" onClick={() => navigate('/map')}>
        Get Started
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
