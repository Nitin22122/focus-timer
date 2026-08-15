import { SessionLog, TimerMode } from '../types';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format time to HH:MM:SS
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Get duration in minutes for mode
export const getModeDuration = (mode: TimerMode, settings: any): number => {
  switch (mode) {
    case 'study':
      return settings.studyDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
    default:
      return settings.studyDuration;
  }
};

// Create session log
export const createSessionLog = (
  startTime: Date,
  endTime: Date,
  subject: string,
  type: any,
  mode: TimerMode
): SessionLog => {
  return {
    id: generateId(),
    startTime,
    endTime,
    subject,
    type,
    duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
    mode
  };
};

// Calculate daily stats from logs
export const calculateDailyStats = (logs: SessionLog[]): { studiedToday: number; sessions: number; breaks: number } => {
  const today = new Date().toDateString();
  const todayLogs = logs.filter(log => new Date(log.startTime).toDateString() === today);
  
  const studiedToday = todayLogs
    .filter(log => log.type === 'StudySession')
    .reduce((acc, log) => acc + log.duration, 0) / 60;
  
  const sessions = todayLogs.filter(log => log.type === 'StudySession').length;
  const breaks = todayLogs.filter(log => log.type === 'BreakSession').length;
  
  return { studiedToday, sessions, breaks };
};