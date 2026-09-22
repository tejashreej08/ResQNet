export default function ErrorState({ message = 'We could not load this data.', onRetry }) {
  return (
    <div className="state-block error-block">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="primary-button small-button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
