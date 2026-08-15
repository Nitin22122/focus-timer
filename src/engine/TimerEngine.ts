import { 
  TimerMode, 
  SessionState, 
  TimerSettings, 
  SessionLog,
  AppState 
} from '../types';
import { 
  DEFAULT_SETTINGS, 
  STORAGE_KEYS,
  SESSION_TYPES 
} from '../utils/constants';
import { 
  generateId, 
  createSessionLog, 
  calculateDailyStats,
  getModeDuration 
} from '../utils/helpers';

export class TimerEngine {
  private state: AppState;
  private timerInterval: NodeJS.Timeout | null = null;
  private tickCallbacks: ((state: AppState) => void)[] = [];
  private completionCallbacks: ((mode: TimerMode) => void)[] = [];
  private sessionStartTime: Date | null = null;
  private isBackgroundRunning: boolean = false;
  private lastTickTime: number = Date.now();

  constructor() {
    this.state = this.loadState();
    this.setupVisibilityChangeHandler();
  }

  // Load state from localStorage
  private loadState(): AppState {
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || 'null');
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.logs) || '[]');
      const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || 'null');
      
      // Convert string dates back to Date objects
      const parsedLogs = logs.map((log: any) => ({
        ...log,
        startTime: new Date(log.startTime),
        endTime: new Date(log.endTime)
      }));

      const currentSession: SessionState = {
        isRunning: false,
        currentMode: 'study',
        timeRemaining: (settings?.studyDuration || DEFAULT_SETTINGS.studyDuration) * 60,
        totalTime: (settings?.studyDuration || DEFAULT_SETTINGS.studyDuration) * 60,
        currentSubject: 'Algorithms',
        cyclesCompleted: 0,
        pomodoroCount: 0
      };

      return {
        settings: settings || DEFAULT_SETTINGS,
        currentSession,
        logs: parsedLogs || [],
        dailyStats: stats || { studiedToday: 0, sessions: 0, breaks: 0, date: new Date().toDateString() },
        soundSettings: JSON.parse(localStorage.getItem(STORAGE_KEYS.sound) || '{"enabled":true,"volume":100,"soundType":"beep"}'),
        subjects: JSON.parse(localStorage.getItem(STORAGE_KEYS.subjects) || '["Algorithms", "Data Structures", "Mathematics"]')
      };
    } catch (error) {
      console.error('Error loading state:', error);
      return this.getDefaultState();
    }
  }

  private getDefaultState(): AppState {
    return {
      settings: DEFAULT_SETTINGS,
      currentSession: {
        isRunning: false,
        currentMode: 'study',
        timeRemaining: DEFAULT_SETTINGS.studyDuration * 60,
        totalTime: DEFAULT_SETTINGS.studyDuration * 60,
        currentSubject: 'Algorithms',
        cyclesCompleted: 0,
        pomodoroCount: 0
      },
      logs: [],
      dailyStats: {
        studiedToday: 0,
        sessions: 0,
        breaks: 0,
        date: new Date().toDateString()
      },
      soundSettings: {
        enabled: true,
        volume: 100,
        soundType: 'beep'
      },
      subjects: ['Algorithms', 'Data Structures', 'Mathematics']
    };
  }

  // Save state to localStorage
  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(this.state.settings));
      localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(this.state.logs));
      localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(this.state.dailyStats));
      localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(this.state.soundSettings));
      localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(this.state.subjects));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Handle visibility change for background timer
  private setupVisibilityChangeHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab is hidden, mark time
        this.lastTickTime = Date.now();
        this.isBackgroundRunning = this.state.currentSession.isRunning;
      } else {
        // Tab is visible again, calculate elapsed time
        if (this.isBackgroundRunning && this.state.currentSession.isRunning) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - this.lastTickTime) / 1000);
          
          if (elapsedSeconds > 0) {
            // Update timer for background time
            const newTime = this.state.currentSession.timeRemaining - elapsedSeconds;
            if (newTime <= 0) {
              // Timer completed in background
              this.state.currentSession.timeRemaining = 0;
              this.handleTimerCompletion();
            } else {
              this.state.currentSession.timeRemaining = newTime;
              this.notifyListeners();
            }
          }
        }
        this.isBackgroundRunning = false;
      }
    });
  }

  // Start the timer
  startTimer(): void {
    if (this.state.currentSession.isRunning) return;

    // If timer is at 0, reset to full duration
    if (this.state.currentSession.timeRemaining <= 0) {
      this.resetCurrentMode();
    }

    this.state.currentSession.isRunning = true;
    this.sessionStartTime = new Date();
    this.lastTickTime = Date.now();
    this.isBackgroundRunning = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    this.notifyListeners();
    this.saveState();
  }

  // Pause the timer
  pauseTimer(): void {
    if (!this.state.currentSession.isRunning) return;

    this.state.currentSession.isRunning = false;
    this.isBackgroundRunning = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.notifyListeners();
    this.saveState();
  }

  // Reset the timer
  resetTimer(): void {
    this.pauseTimer();
    this.resetCurrentMode();
    this.sessionStartTime = null;
    this.notifyListeners();
    this.saveState();
  }

  // Reset current mode to full duration
  private resetCurrentMode(): void {
    const duration = getModeDuration(
      this.state.currentSession.currentMode,
      this.state.settings
    );
    this.state.currentSession.timeRemaining = duration * 60;
    this.state.currentSession.totalTime = duration * 60;
  }

  // Timer tick
  private tick(): void {
    const now = Date.now();
    const elapsed = Math.floor((now - this.lastTickTime) / 1000);
    this.lastTickTime = now;

    if (elapsed <= 0) return;

    const newTime = this.state.currentSession.timeRemaining - elapsed;
    
    if (newTime <= 0) {
      this.state.currentSession.timeRemaining = 0;
      this.handleTimerCompletion();
    } else {
      this.state.currentSession.timeRemaining = newTime;
      this.notifyListeners();
    }
  }

  // Handle timer completion
  private handleTimerCompletion(): void {
    this.state.currentSession.isRunning = false;
    this.isBackgroundRunning = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Log the completed session
    if (this.sessionStartTime) {
      const endTime = new Date();
      const log = createSessionLog(
        this.sessionStartTime,
        endTime,
        this.state.currentSession.currentSubject,
        this.state.currentSession.currentMode === 'study' 
          ? SESSION_TYPES.study 
          : SESSION_TYPES.break,
        this.state.currentSession.currentMode
      );
      
      this.state.logs.push(log);
      this.updateDailyStats(log);
      this.sessionStartTime = null;
    }

    // Update pomodoro count for study sessions
    if (this.state.currentSession.currentMode === 'study') {
      this.state.currentSession.pomodoroCount++;
      
      // Check if we've completed a full session (3 pomodoros)
      if (this.state.currentSession.pomodoroCount >= this.state.settings.pomodorosPerSession) {
        this.state.currentSession.pomodoroCount = 0;
        this.state.currentSession.cyclesCompleted++;
        // Switch to long break
        this.switchMode('longBreak');
      } else {
        // Switch to short break
        this.switchMode('shortBreak');
      }
    } else {
      // Break completed, switch back to study
      this.switchMode('study');
    }

    // Notify completion
    this.completionCallbacks.forEach(cb => cb(this.state.currentSession.currentMode));
    this.notifyListeners();
    this.saveState();

    // Auto-start next session if enabled
    if (this.state.settings.autoStartNext) {
      setTimeout(() => {
        this.startTimer();
      }, 1000);
    }
  }

  // Switch timer mode
  switchMode(mode: TimerMode): void {
    this.pauseTimer();
    this.state.currentSession.currentMode = mode;
    this.resetCurrentMode();
    this.notifyListeners();
    this.saveState();
  }

  // Update daily statistics
  private updateDailyStats(log: SessionLog): void {
    const today = new Date().toDateString();
    if (this.state.dailyStats.date !== today) {
      // Reset daily stats for new day
      this.state.dailyStats = {
        studiedToday: 0,
        sessions: 0,
        breaks: 0,
        date: today
      };
    }

    if (log.type === 'StudySession') {
      this.state.dailyStats.studiedToday += log.duration / 60;
      this.state.dailyStats.sessions++;
    } else {
      this.state.dailyStats.breaks++;
    }
  }

  // Change current subject
  setSubject(subject: string): void {
    this.state.currentSession.currentSubject = subject;
    this.notifyListeners();
    this.saveState();
  }

  // Get current state
  getState(): AppState {
    return this.state;
  }

  // Add subject
  addSubject(subject: string): void {
    if (!this.state.subjects.includes(subject)) {
      this.state.subjects.push(subject);
      this.saveState();
      this.notifyListeners();
    }
  }

  // Remove subject
  removeSubject(subject: string): void {
    this.state.subjects = this.state.subjects.filter(s => s !== subject);
    if (this.state.currentSession.currentSubject === subject) {
      this.state.currentSession.currentSubject = this.state.subjects[0] || 'General';
    }
    this.saveState();
    this.notifyListeners();
  }

  // Clear logs
  clearLogs(): void {
    this.state.logs = [];
    this.state.dailyStats = {
      studiedToday: 0,
      sessions: 0,
      breaks: 0,
      date: new Date().toDateString()
    };
    this.saveState();
    this.notifyListeners();
  }

  // Update settings
  updateSettings(newSettings: Partial<TimerSettings>): void {
    this.state.settings = { ...this.state.settings, ...newSettings };
    // Reset current timer if it's at 0 or if mode duration changed
    if (this.state.currentSession.timeRemaining <= 0) {
      this.resetCurrentMode();
    }
    this.saveState();
    this.notifyListeners();
  }

  // Update sound settings
  updateSoundSettings(newSettings: Partial<typeof this.state.soundSettings>): void {
    this.state.soundSettings = { ...this.state.soundSettings, ...newSettings };
    this.saveState();
    this.notifyListeners();
  }

  // Register listeners
  onTick(callback: (state: AppState) => void): void {
    this.tickCallbacks.push(callback);
  }

  onComplete(callback: (mode: TimerMode) => void): void {
    this.completionCallbacks.push(callback);
  }

  // Notify listeners
  private notifyListeners(): void {
    this.tickCallbacks.forEach(cb => cb(this.state));
  }

  // Clean up
  destroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.tickCallbacks = [];
    this.completionCallbacks = [];
  }

  // Get logs filtered by date
  getLogsForDate(date: Date): SessionLog[] {
    const dateStr = date.toDateString();
    return this.state.logs.filter(log => 
      new Date(log.startTime).toDateString() === dateStr
    );
  }

  // Get total study time for a subject
  getStudyTimeForSubject(subject: string): number {
    return this.state.logs
      .filter(log => log.subject === subject && log.type === 'StudySession')
      .reduce((acc, log) => acc + log.duration, 0) / 60;
  }
}