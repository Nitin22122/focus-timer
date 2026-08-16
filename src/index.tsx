import React from 'react';
import ReactDOM from 'react-dom/client';
import { TimerApp } from './components/TimerApp';
import './styles/global.css';

const isPopout = new URLSearchParams(window.location.search).get('popout') === 'true';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <TimerApp />
  </React.StrictMode>
);

if (isPopout) {
  document.title = 'Pomodoro Timer - Popout';
  window.addEventListener('beforeunload', () => {
    if (window.opener) {
      window.opener.postMessage({ type: 'POPOUT_CLOSED' }, '*');
    }
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target === document.body && e.key === ' ') {
    e.preventDefault();
    const engine = (window as any).__timerEngine;
    if (engine) {
      const state = engine.getState();
      if (state.currentSession.isRunning) {
        engine.pauseTimer();
      } else {
        engine.startTimer();
      }
    }
  }
  
  if (e.key === 'Escape' && isPopout) {
    window.close();
  }
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'POPOUT_CLOSED') {
    console.log('Popout window closed');
  }
});