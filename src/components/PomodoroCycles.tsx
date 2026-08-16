import React from 'react';
import { TimerMode } from '../types';
import '../styles/PomodoroCycles.css';

interface PomodoroCyclesProps {
  currentCycle: number;
  totalCycles: number;
  mode: TimerMode;
  currentSubject: string;
}

export const PomodoroCycles: React.FC<PomodoroCyclesProps> = ({
  currentCycle,
  totalCycles,
  mode,
  currentSubject
}) => {
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

  // Calculate time spent in current cycle
  const getCycleTime = (): string => {
    if (mode === 'study') {
      return `${currentCycle > 0 ? Math.round(currentCycle * 25) : 0}m STUDY`;
    }
    return getModeLabel();
  };

  return (
    <div className="pomodoro-cycles">
      <div className="cycles-header">
        <span className="cycles-label">POMODORO CYCLES</span>
        <span className="cycles-time">{getCycleTime()}</span>
      </div>
      <div className="cycles-progress">
        {Array.from({ length: totalCycles }, (_, i) => (
          <div
            key={i}
            className={`cycle-dot ${i < currentCycle ? 'completed' : ''} 
                       ${i === currentCycle && mode === 'study' ? 'active' : ''}`}
            title={`Cycle ${i + 1} of ${totalCycles}`}
          />
        ))}
      </div>
      <div className="cycles-info">
        <span className="cycles-subject">{currentSubject}</span>
        <span className="cycles-count">
          {currentCycle} / {totalCycles} cycles
        </span>
      </div>
    </div>
  );
};