export default function EmptyState({ title = 'No data available', message = 'There are no live updates right now.' }) {
  return (
    <div className="state-block empty-block">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
