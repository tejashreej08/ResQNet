import { useMemo, useState } from 'react';
import { ArrowLeft, Camera, LocateFixed, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IncidentTypeCard from '../components/reports/IncidentTypeCard';
import SeveritySelector from '../components/reports/SeveritySelector';
import { submitIncidentReport } from '../services/reportService';

const incidentTypes = ['Flooding', 'Earthquake', 'Landslide', 'Fire', 'Person Trapped', 'Road Blocked'];

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('Flooding');
  const [severity, setSeverity] = useState('Moderate');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const locationText = useMemo(() => 'Auto-detected near Chennai Coast, 12.924°N, 80.101°E', []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description.trim()) {
      setError('Please add a short description before submitting.');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    const result = await submitIncidentReport({
      type,
      severity,
      description,
      location: locationText,
      image,
    });

    setLoading(false);

    if (result?.success || result?.__demo) {
      setSuccess('Incident report submitted successfully. Demo mode only — no real dispatch has been triggered.');
      setDescription('');
    } else {
      setError(result?.message || 'Could not submit the report.');
    }
  };

  return (
    <div className="app-shell detail-shell">
      <header className="detail-header">
        <button type="button" className="icon-button" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>Report Incident</h2>
          <p className="tiny-info">Location auto-detected</p>
        </div>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <label className="upload-box" htmlFor="incident-photo">
          {image ? <img src={image} alt="Incident preview" className="image-preview" /> : <Camera size={26} />}
          <span>{image ? 'Change photo' : 'Tap to upload a photo'}</span>
        </label>
        <input id="incident-photo" type="file" accept="image/*" capture="environment" onChange={handleImageUpload} hidden />

        <div className="report-group">
          <label>Incident type</label>
          <div className="type-grid">
            {incidentTypes.map((item) => (
              <IncidentTypeCard key={item} type={item} active={type === item} onSelect={setType} />
            ))}
          </div>
        </div>

        <div className="report-group">
          <label>Severity</label>
          <SeveritySelector value={severity} onChange={setSeverity} options={['Low', 'Moderate', 'Critical']} />
        </div>

        <div className="report-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the situation, blocked roads, trapped people, or rising water levels..."
          />
        </div>

        <div className="location-summary report-location">
          <div>
            <MapPin size={14} />
            <span>{locationText}</span>
          </div>
          <LocateFixed size={16} />
        </div>

        {error ? <div className="feedback-box error"><span>{error}</span></div> : null}
        {success ? <div className="feedback-box success"><span>{success}</span></div> : null}

        <button type="submit" className="primary-button full-width-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
