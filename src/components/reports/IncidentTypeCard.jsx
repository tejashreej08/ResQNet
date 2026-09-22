export default function IncidentTypeCard({ type, active, onSelect }) {
  return (
    <button
      type="button"
      className={`incident-type-card ${active ? 'selected' : ''}`}
      onClick={() => onSelect(type)}
    >
      {type}
    </button>
  );
}
