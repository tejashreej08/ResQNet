export default function SeveritySelector({ value, onChange, options = ['Low', 'Moderate', 'Critical'] }) {
  return (
    <div className="severity-selector">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`severity-option ${value === option ? 'selected' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
