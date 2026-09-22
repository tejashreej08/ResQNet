export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="state-block loading-block" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
