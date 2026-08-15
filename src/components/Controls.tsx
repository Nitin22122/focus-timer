import React from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSaveSubject: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSaveSubject
}) => {
  return (
    <div className="controls">
      <div className="controls-main">
        {!isRunning ? (
          <button className="control-btn start-btn" onClick={onStart}>
            START
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={onPause}>
            PAUSE
          </button>
        )}
      </div>
      <div className="controls-secondary">
        <button className="control-btn secondary-btn" onClick={onSaveSubject}>
          Save Subject Time
        </button>
        <span className="control-hint">(resets timer)</span>
        <button className="control-btn reset-btn" onClick={onReset}>
          Reset Timer
        </button>
      </div>
    </div>
  );
};