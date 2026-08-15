import { TimerEngine } from './engine/TimerEngine';

// Singleton instance
let timerEngine: TimerEngine | null = null;

export const getTimerEngine = (): TimerEngine => {
  if (!timerEngine) {
    timerEngine = new TimerEngine();
  }
  return timerEngine;
};

// For debugging
if (typeof window !== 'undefined') {
  (window as any).timerEngine = getTimerEngine();
}

export * from './types';
export * from './utils/constants';
export * from './utils/helpers';