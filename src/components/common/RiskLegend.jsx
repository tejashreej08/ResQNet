import { defaultRiskLegend } from '../../data/mockData';

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
