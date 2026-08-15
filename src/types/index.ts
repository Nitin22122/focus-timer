// Timer modes
export type TimerMode = 'study' | 'shortBreak' | 'longBreak';

// Session types
export type SessionType = 'StudySession' | 'BreakSession';

// Timer settings
export interface TimerSettings {
  pomodorosPerSession: number;
  dailyTargetHours: number;
  studyDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  autoStartNext: boolean;
}

// Session log entry
export interface SessionLog {
  id: string;
  startTime: Date;
  endTime: Date;
  subject: string;
  type: SessionType;
  duration: number; // in seconds
  mode: TimerMode;
}

// Current session state
export interface SessionState {
  isRunning: boolean;
  currentMode: TimerMode;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  currentSubject: string;
  cyclesCompleted: number;
  pomodoroCount: number;
}

// Daily statistics
export interface DailyStats {
  studiedToday: number; // in minutes
  sessions: number;
  breaks: number;
  date: string;
}

// Sound settings
export interface SoundSettings {
  enabled: boolean;
  volume: number;
  soundType: 'beep' | 'chime' | 'bell';
}

// App state
export interface AppState {
  settings: TimerSettings;
  currentSession: SessionState;
  logs: SessionLog[];
  dailyStats: DailyStats;
  soundSettings: SoundSettings;
  subjects: string[];
}