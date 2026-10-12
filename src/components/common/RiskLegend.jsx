const defaultRiskLegend = [
  { label: 'Critical', color: '#ff5b57' },
  { label: 'High', color: '#ff9f43' },
  { label: 'Moderate', color: '#f6d365' },
  { label: 'Safe', color: '#3be7c7' },
];

export default function RiskLegend({ items = defaultRiskLegend }) {
  return (
    <div className="risk-legend">
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <span className="legend-swatch" style={{ background: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
