import React from 'react';
import { formatTime } from '../utils/helpers';
import { TimerMode } from '../types';
import '../styles/TimerDisplay.css';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  mode: TimerMode;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  totalTime,
  isRunning,
  mode
}) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const timeString = formatTime(timeRemaining);
  
  const getModeColor = (): string => {
    switch (mode) {
      case 'study':
        return '#4CAF50';
      case 'shortBreak':
        return '#2196F3';
      case 'longBreak':
        return '#9C27B0';
      default:
        return '#4CAF50';
    }
  };

  const getModeLabel = (): string => {
    switch (mode) {
      case 'study':
        return 'STUDY';
      case 'shortBreak':
        return 'SHORT BREAK';
      case 'longBreak':
        return 'LONG BREAK';
      default:
        return 'STUDY';
    }
  };

  const color = getModeColor();

  return (
    <div className="timer-display">
      <div className="timer-mode-label">{getModeLabel()}</div>
      <div className="timer-circle">
        <svg className="timer-progress-ring" viewBox="0 0 120 120">
          <circle
            className="timer-progress-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          <circle
            className="timer-progress-fg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        <div className="timer-time">{timeString}</div>
        <div className="timer-status">
          {isRunning ? '▶ RUNNING' : '⏸ PAUSED'}
        </div>
      </div>
    </div>
  );
};