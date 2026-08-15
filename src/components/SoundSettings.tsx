import React from 'react';
import '../styles/SoundSettings.css';

interface SoundSettingsProps {
  settings: {
    enabled: boolean;
    volume: number;
    soundType: string;
  };
  onUpdate: (settings: any) => void;
  onTest: () => void;
}

export const SoundSettings: React.FC<SoundSettingsProps> = ({
  settings,
  onUpdate,
  onTest
}) => {
  const handleChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="sound-settings">
      <div className="sound-header">
        <h3>SOUND SETTINGS</h3>
        <button className="test-sound-btn" onClick={onTest}>
          Test Sound
        </button>
      </div>

      <div className="sound-controls">
        <div className="sound-item">
          <label className="sound-toggle">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
            />
            Enable Sound
          </label>
        </div>

        <div className="sound-item">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => handleChange('volume', parseInt(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-value">{settings.volume}%</span>
        </div>

        <div className="sound-item">
          <label>Sound Type</label>
          <select
            value={settings.soundType}
            onChange={(e) => handleChange('soundType', e.target.value)}
            className="sound-select"
          >
            <option value="beep">Beep</option>
            <option value="chime">Chime</option>
            <option value="bell">Bell</option>
          </select>
        </div>
      </div>
    </div>
  );
};