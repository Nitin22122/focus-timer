// Export everything
export { getTimerEngine, TimerEngine } from './engine';
export * from './types';
export * from './utils/constants';
export * from './utils/helpers';

// Also expose globally
if (typeof window !== 'undefined') {
  const { getTimerEngine } = require('./engine');
  (window as any).__timerEngine = getTimerEngine();
}