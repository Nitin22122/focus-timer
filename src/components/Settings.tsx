import React, { useState } from 'react';
import { TimerSettings } from '../types';
import '../styles/Settings.css';

interface SettingsProps {
  settings: TimerSettings;
  onUpdate: (settings: Partial<TimerSettings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof TimerSettings, value: any) => {
    onUpdate({ [key]: value });
  };

  // Quick select cycles
  const cycleOptions = [1,2, 3, 4, 5, 6,7, 8, 10];

  return (
    <div className="settings-panel">
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ {isOpen ? 'Close Settings' : 'Settings'}
      </button>

      {isOpen && (
        <div className="settings-content fade-in">
          <div className="settings-section">
            <h4>Preferences</h4>
            
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox"
                  checked={settings.autoStartNext}
                  onChange={(e) => handleChange('autoStartNext', e.target.checked)}
                />
                Auto-start next session
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h4>POMODOROS / SESSION</h4>
            <div className="cycle-selector">
              <div className="cycle-quick-select">
                {cycleOptions.map((num) => (
                  <button
                    key={num}
                    className={`cycle-btn ${settings.pomodorosPerSession === num ? 'active' : ''}`}
                    onClick={() => handleChange('pomodorosPerSession', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="cycle-custom">
                <label>Custom:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.pomodorosPerSession}
                  onChange={(e) => handleChange('pomodorosPerSession', parseInt(e.target.value) || 3)}
                  className="settings-input"
                />
                <span className="setting-label">pomodoros per session</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>DAILY TARGET (HRS)</h4>
            <div className="setting-item">
              <input
                type="number"
                min="1"
                max="12"
                value={settings.dailyTargetHours}
                onChange={(e) => handleChange('dailyTargetHours', parseInt(e.target.value) || 6)}
                className="settings-input"
              />
              <span className="setting-label">hours</span>
            </div>
          </div>

          <div className="settings-section">
            <h4>Timer Durations (minutes)</h4>
            <div className="setting-row">
              <div className="setting-item">
                <label>Study</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={settings.studyDuration}
                  onChange={(e) => handleChange('studyDuration', parseInt(e.target.value) || 25)}
                  className="settings-input-small"
                />
              </div>
              <div className="setting-item">
                <label>Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={settings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) || 5)}
                  className="settings-input-small"
                />
              </div>
              <div className="setting-item">
                <label>Long Break</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={settings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="settings-input-small"
                />
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              className="settings-save-btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};