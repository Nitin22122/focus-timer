import React from 'react';
import ReactDOM from 'react-dom/client';
import { TimerApp } from './components/TimerApp';
import './styles/global.css';

// Check if we're in popout mode
const isPopout = new URLSearchParams(window.location.search).get('popout') === 'true';

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <TimerApp />
  </React.StrictMode>
);

// Handle popout window communication
if (isPopout) {
  document.title = 'Pomodoro Timer - Popout';
  
  // Send message to parent window when popout closes
  window.addEventListener('beforeunload', () => {
    if (window.opener) {
      window.opener.postMessage({ type: 'POPOUT_CLOSED' }, '*');
    }
  });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Space to toggle timer
  if (e.target === document.body && e.key === ' ') {
    e.preventDefault();
    // Use dynamic import to avoid circular dependency
    import('./index').then(({ getTimerEngine }) => {
      const engine = getTimerEngine();
      const state = engine.getState();
      if (state.currentSession.isRunning) {
        engine.pauseTimer();
      } else {
        engine.startTimer();
      }
    });
  }
  
  // Escape to close popout
  if (e.key === 'Escape' && isPopout) {
    window.close();
  }
});

// Handle messages from popout window
window.addEventListener('message', (event) => {
  if (event.data.type === 'POPOUT_CLOSED') {
    // Parent window can handle popout closure
    console.log('Popout window closed');
  }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}