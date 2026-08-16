export { getTimerEngine, TimerEngine } from './engine';
export * from './types';
export * from './utils/constants';
export * from './utils/helpers';

// Singleton instance
let timerEngineInstance: any = null;

export const getTimerEngine = (): any => {
  if (!timerEngineInstance) {
    // Use dynamic import to avoid circular dependencies
    const { TimerEngine } = require('./engine/TimerEngine');
    timerEngineInstance = new TimerEngine();
  }
  return timerEngineInstance;
};

// For debugging in browser
if (typeof window !== 'undefined') {
  (window as any).timerEngine = getTimerEngine();
}