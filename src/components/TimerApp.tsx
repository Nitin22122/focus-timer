import React, { useState, useEffect, useRef } from 'react';
import { getTimerEngine } from '../engine';
import { AppState, TimerMode } from '../types';
import { TimerDisplay } from './TimerDisplay';
import { Controls } from './Controls';
import { StatsPanel } from './StatsPanel';
import { SessionLogs } from './SessionLogs';
import { Settings } from './Settings';
import { SoundSettings } from './SoundSettings';
import { SubjectSelector } from './SubjectSelector';
import { PomodoroCycles } from './PomodoroCycles';
import '../styles/TimerApp.css';

export const TimerApp: React.FC = () => {
  // Get engine instance once
  const engine = getTimerEngine();
  const [state, setState] = useState<AppState>(() => engine.getState());
  const [isPopout, setIsPopout] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const popoutWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const handleTick = (newState: AppState) => {
      setState(newState);
    };

    const handleComplete = (mode: TimerMode) => {
      const currentState = engine.getState();
      if (currentState.soundSettings.enabled) {
        playCompletionSound(currentState.soundSettings.soundType, currentState.soundSettings.volume);
      }
    };

    engine.onTick(handleTick);
    engine.onComplete(handleComplete);

    return () => {
      // Cleanup if needed
    };
  }, [engine]);

  const playCompletionSound = (type: string, volume: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = volume / 100;
      
      if (type === 'beep') {
        oscillator.frequency.value = 440;
        oscillator.type = 'square';
      } else if (type === 'chime') {
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
      } else if (type === 'bell') {
        oscillator.frequency.value = 659.25;
        oscillator.type = 'triangle';
      }
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleStart = () => engine.startTimer();
  const handlePause = () => engine.pauseTimer();
  const handleReset = () => engine.resetTimer();
  const handleSubjectChange = (subject: string) => engine.setSubject(subject);
  
  const handleSaveSubjectTime = () => {
    if (state.currentSession.isRunning) {
      engine.pauseTimer();
    }
    engine.resetTimer();
  };

  const handlePopout = () => {
    if (isPopout) {
      if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
        popoutWindowRef.current.close();
      }
      setIsPopout(false);
      popoutWindowRef.current = null;
    } else {
      const width = 400;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const popout = window.open(
        '',
        'PomodoroTimer',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
      );
      
      if (popout) {
        popout.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Pomodoro Timer</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                #root { height: 100vh; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script>
                window.location.href = window.location.origin + '?popout=true';
              </script>
            </body>
          </html>
        `);
        popoutWindowRef.current = popout;
        setIsPopout(true);
      }
    }
  };

  const handleZenMode = () => setIsZenMode(!isZenMode);
  
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`timer-app ${isZenMode ? 'zen-mode' : ''}`}>
      <div className="app-header">
        <div className="app-title">
          <h1>DAILY FOCUS</h1>
        </div>
        <div className="app-controls">
          <button className="control-btn" onClick={handlePopout} title="Popout">
            {isPopout ? '📌' : '📎'}
          </button>
          <button className="control-btn" onClick={handleZenMode} title="Zen Mode">
            🧘
          </button>
          <button className="control-btn" onClick={handleFullscreen} title="Fullscreen">
            ⛶
          </button>
        </div>
      </div>

      <div className="app-content">
        <div className="main-timer-section">
          <div className="timer-mode-selector">
            <button 
              className={`mode-btn ${state.currentSession.currentMode === 'study' ? 'active' : ''}`}
              onClick={() => engine.switchMode('study')}
            >
              STUDY SESSION #{(state.currentSession.cyclesCompleted || 0) + 1}
            </button>
          </div>

          <TimerDisplay 
            timeRemaining={state.currentSession.timeRemaining}
            totalTime={state.currentSession.totalTime}
            isRunning={state.currentSession.isRunning}
            mode={state.currentSession.currentMode}
          />

          <SubjectSelector 
            currentSubject={state.currentSession.currentSubject}
            subjects={state.subjects}
            onSubjectChange={handleSubjectChange}
          />

          <Controls 
            isRunning={state.currentSession.isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSaveSubject={handleSaveSubjectTime}
          />
        </div>

        <div className="sidebar-section">
          <PomodoroCycles 
            currentCycle={state.currentSession.pomodoroCount}
            totalCycles={state.settings.pomodorosPerSession}
            mode={state.currentSession.currentMode}
            currentSubject={state.currentSession.currentSubject}
          />

          <StatsPanel 
            studiedToday={state.dailyStats.studiedToday}
            sessions={state.dailyStats.sessions}
            breaks={state.dailyStats.breaks}
            dailyTarget={state.settings.dailyTargetHours}
          />

          <div className="topics-section">
            <h3>Today's Topics</h3>
            <div className="topics-list">
              {state.subjects.map((subject, index) => (
                <div key={index} className="topic-item">
                  <span>{subject}</span>
                  <span className="topic-time">
                    {Math.round(state.logs
                      .filter(log => log.subject === subject && 
                        new Date(log.startTime).toDateString() === new Date().toDateString())
                      .reduce((acc, log) => acc + log.duration, 0) / 60)}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          <SoundSettings 
            settings={state.soundSettings}
            onUpdate={(settings) => engine.updateSoundSettings(settings)}
            onTest={() => playCompletionSound(state.soundSettings.soundType, state.soundSettings.volume)}
          />

          <SessionLogs 
            logs={state.logs.slice(0, 5)}
            onClear={() => engine.clearLogs()}
          />

          <Settings 
            settings={state.settings}
            onUpdate={(settings) => engine.updateSettings(settings)}
          />
        </div>
      </div>
    </div>
  );
};