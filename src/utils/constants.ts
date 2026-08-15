export const DEFAULT_SETTINGS = {
  pomodorosPerSession: 3,
  dailyTargetHours: 6,
  studyDuration: 50,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartNext: true
};

export const TIMER_MODES = {
  study: 'STUDY',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK'
} as const;

export const SESSION_TYPES = {
  study: 'StudySession',
  break: 'BreakSession'
} as const;

export const STORAGE_KEYS = {
  settings: 'pomodoro_settings',
  logs: 'pomodoro_logs',
  stats: 'pomodoro_stats',
  sound: 'pomodoro_sound',
  subjects: 'pomodoro_subjects'
};