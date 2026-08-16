import { TimerEngine } from './TimerEngine';

let timerEngineInstance: TimerEngine | null = null;

export const getTimerEngine = (): TimerEngine => {
  if (!timerEngineInstance) {
    timerEngineInstance = new TimerEngine();
  }
  return timerEngineInstance;
};

export { TimerEngine };

if (typeof window !== 'undefined') {
  (window as any).__timerEngine = getTimerEngine();
}