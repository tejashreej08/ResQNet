import { useEffect, useRef, useState } from 'react';
import { Siren } from 'lucide-react';

export default function EmergencySOSButton({ onTrigger, activeText = 'Hold the button for 3 seconds to send emergency SOS' }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const clearTimers = () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
  };

  useEffect(() => () => clearTimers(), []);

  const startHold = () => {
    setHolding(true);
    setProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((value) => {
        const nextValue = value + 2;
        if (nextValue >= 100) {
          clearTimers();
          setHolding(false);
          onTrigger?.();
          return 100;
        }
        return nextValue;
      });
    }, 60);

    holdTimerRef.current = window.setTimeout(() => {
      clearTimers();
      setHolding(false);
      onTrigger?.();
      setProgress(100);
    }, 3000);
  };

  const cancelHold = () => {
    clearTimers();
    setHolding(false);
    setProgress(0);
  };

  return (
    <div className="sos-button-wrap">
      <button
        type="button"
        className={`sos-button ${holding ? 'holding' : ''}`}
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startHold();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            cancelHold();
          }
        }}
        aria-label="Emergency SOS"
      >
        <span className="sos-inner">
          <Siren size={34} />
        </span>
      </button>
      <div className="sos-progress" aria-live="polite">
        <div className="sos-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="sos-hint">{activeText}</p>
    </div>
  );
}
