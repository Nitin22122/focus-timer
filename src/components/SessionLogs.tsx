import React from 'react';
import { SessionLog } from '../types';
import { formatTime } from '../utils/helpers';
import '../styles/SessionLogs.css';

interface SessionLogsProps {
  logs: SessionLog[];
  onClear: () => void;
}

export const SessionLogs: React.FC<SessionLogsProps> = ({ logs, onClear }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeColor = (type: string): string => {
    return type === 'StudySession' ? '#4CAF50' : '#2196F3';
  };

  return (
    <div className="session-logs">
      <div className="logs-header">
        <h3>Time-Wise Session Log</h3>
        <button className="clear-logs-btn" onClick={onClear}>
          Clear Logs
        </button>
      </div>
      
      <div className="logs-table">
        <div className="logs-table-header">
          <span>START-END</span>
          <span>SUBJECT</span>
          <span>TYPE</span>
          <span>DURATION</span>
        </div>
        
        {logs.length === 0 ? (
          <div className="logs-empty">
            <p>No sessions logged yet</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="logs-table-row">
              <span>
                {formatDate(log.startTime)} - {formatDate(log.endTime)}
              </span>
              <span className="log-subject">{log.subject}</span>
              <span 
                className="log-type"
                style={{ color: getTypeColor(log.type) }}
              >
                {log.type}
              </span>
              <span className="log-duration">
                {formatTime(log.duration)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};