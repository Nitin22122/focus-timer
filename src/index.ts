import { TimerEngine } from './engine/TimerEngine';

// Singleton instance
let timerEngineInstance: TimerEngine | null = null;

export const getTimerEngine = (): TimerEngine => {
  if (!timerEngineInstance) {
    timerEngineInstance = new TimerEngine();
  }
  return timerEngineInstance;
};

// For debugging
if (typeof window !== 'undefined') {
  (window as any).timerEngine = getTimerEngine();
}

export * from './types';
export * from './utils/constants';
export * from './utils/helpers';