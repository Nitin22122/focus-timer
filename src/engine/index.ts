import { TimerEngine } from './TimerEngine';

let timerEngineInstance: TimerEngine | null = null;

export function getTimerEngine(): TimerEngine {
  if (!timerEngineInstance) {
    timerEngineInstance = new TimerEngine();
  }
  return timerEngineInstance;
}

export { TimerEngine };

// Expose globally for keyboard shortcuts
if (typeof window !== 'undefined') {
  (window as any).__timerEngine = getTimerEngine();
}