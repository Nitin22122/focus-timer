import React from 'react';
import '../styles/StatsPanel.css';

interface StatsPanelProps {
  studiedToday: number;
  sessions: number;
  breaks: number;
  dailyTarget: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  studiedToday,
  sessions,
  breaks,
  dailyTarget
}) => {
  const progress = Math.min((studiedToday / dailyTarget) * 100, 100);

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>STUDIED TODAY</h3>
        <span className="stats-target">
          {Math.round(studiedToday)}h / {dailyTarget}h
        </span>
      </div>
      
      <div className="stats-progress-bar">
        <div 
          className="stats-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{sessions}</div>
          <div className="stat-label">SESSIONS</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{breaks}</div>
          <div className="stat-label">BREAKS</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{Math.round(studiedToday * 60)}</div>
          <div className="stat-label">MINUTES</div>
        </div>
      </div>
    </div>
  );
};