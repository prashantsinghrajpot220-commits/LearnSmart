import AsyncStorage from '@react-native-async-storage/async-storage';
import { PomodoroSession, TimerSettings, TimerPhase } from '@/types/productivity';

const SESSIONS_STORAGE_KEY = '@learnsmart_pomodoro_sessions';
const SETTINGS_STORAGE_KEY = '@learnsmart_pomodoro_settings';
const ACTIVE_SESSION_KEY = '@learnsmart_active_pomodoro';

const DEFAULT_SETTINGS: TimerSettings = {
  studyDuration: 25,
  breakDuration: 5,
  soundEnabled: true,
  hapticEnabled: true,
  autoStartBreak: false,
  autoStartStudy: false,
};

export interface ActiveTimerState {
  remainingTime: number; // in seconds
  phase: TimerPhase;
  sessionId: string;
  totalDuration: number;
  lastTick: number; // timestamp
  subject?: string;
  chapter?: string;
}

class TimerService {
  private timerInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(state: ActiveTimerState | null) => void> = [];
  private activeState: ActiveTimerState | null = null;

  // Settings management
  async loadSettings(): Promise<TimerSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (error) {
                  // Error handled silently
    }
    return DEFAULT_SETTINGS;
  }

  async saveSettings(settings: Partial<TimerSettings>): Promise<void> {
    try {
      const current = await this.loadSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
                  // Error handled silently
    }
  }

  // Session management
  async startStudySession(
    studyDuration: number,
    breakDuration: number,
    subject?: string,
    chapter?: string
  ): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: PomodoroSession = {
      id: sessionId,
      studyDuration,
      breakDuration,
      actualStudyTime: 0,
      focusScore: 0,
      phase: 'study',
      subject,
      chapter,
      treeSurvived: false,
      startTime: new Date().toISOString(),
    };

    // Save session immediately
    await this.saveSession(session);

    // Set up active timer state
    this.activeState = {
      remainingTime: studyDuration * 60,
      phase: 'study',
      sessionId,
      totalDuration: studyDuration * 60,
      lastTick: Date.now(),
      subject,
      chapter,
    };

    // Start the timer
    this.startTimer();

    // Persist active state
    await this.saveActiveState(this.activeState);

    return sessionId;
  }

  async pauseSession(): Promise<void> {
    if (!this.activeState) return;

    this.activeState.phase = 'paused';
    await this.saveActiveState(this.activeState);
    this.notifyListeners();

    // Update session in storage
    const session = await this.getSession(this.activeState.sessionId);
    if (session) {
      session.phase = 'paused';
      await this.saveSession(session);
    }
  }

  async resumeSession(): Promise<void> {
    if (!this.activeState) return;

    this.activeState.phase = this.activeState.remainingTime === this.activeState.totalDuration ? 'study' : 'break';
    this.activeState.lastTick = Date.now();
    await this.saveActiveState(this.activeState);
    this.startTimer();
    this.notifyListeners();

    // Update session in storage
    const session = await this.getSession(this.activeState.sessionId);
    if (session) {
      session.phase = this.activeState.phase;
      await this.saveSession(session);
    }
  }

  async resetSession(): Promise<void> {
    this.stopTimer();
    this.activeState = null;
    await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
    this.notifyListeners();
  }

  async startBreakSession(breakDuration: number): Promise<void> {
    if (!this.activeState) return;

    const settings = await this.loadSettings();
    const session = await this.getSession(this.activeState.sessionId);

    if (session) {
      // Save the completed study session
      session.actualStudyTime = settings.studyDuration * 60 - this.activeState.remainingTime;
      session.phase = 'break';
      await this.saveSession(session);
    }

    this.activeState.phase = 'break';
    this.activeState.remainingTime = breakDuration * 60;
    this.activeState.totalDuration = breakDuration * 60;
    this.activeState.lastTick = Date.now();
    await this.saveActiveState(this.activeState);
    this.startTimer();
    this.notifyListeners();
  }

  // Timer management
  private startTimer(): void {
    this.stopTimer();
    
    this.timerInterval = setInterval(() => {
      if (!this.activeState) return;

      const now = Date.now();
      const elapsed = Math.floor((now - this.activeState.lastTick) / 1000);
      
      if (elapsed > 0) {
        this.activeState.remainingTime = Math.max(0, this.activeState.remainingTime - elapsed);
        this.activeState.lastTick = now;
        
        if (this.activeState.remainingTime <= 0) {
          this.handleTimerComplete();
        } else {
          this.saveActiveState(this.activeState);
          this.notifyListeners();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private async handleTimerComplete(): Promise<void> {
    if (!this.activeState) return;

    const phase = this.activeState.phase;
    
    // Stop the timer
    this.stopTimer();

    // Update session
    const session = await this.getSession(this.activeState.sessionId);
    if (session) {
      if (phase === 'study') {
        session.actualStudyTime = session.studyDuration * 60;
        session.endTime = new Date().toISOString();
        session.phase = 'break';
      } else {
        session.endTime = new Date().toISOString();
        session.phase = 'study';
      }
      await this.saveSession(session);
    }

    // Clear active state
    this.activeState = null;
    await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
    this.notifyListeners();
  }

  // Session storage
  private async saveSession(session: PomodoroSession): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const index = sessions.findIndex((s) => s.id === session.id);
      
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }
      
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
                  // Error handled silently
    }
  }

  async getSession(sessionId: string): Promise<PomodoroSession | null> {
    try {
      const sessions = await this.getAllSessions();
      return sessions.find((s) => s.id === sessionId) || null;
    } catch (error) {
                  // Error handled silently
      return null;
    }
  }

  async getAllSessions(): Promise<PomodoroSession[]> {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
                  // Error handled silently
      return [];
    }
  }

  async getSessionHistory(days: number = 7): Promise<PomodoroSession[]> {
    try {
      const sessions = await this.getAllSessions();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      cutoffDate.setHours(0, 0, 0, 0);

      return sessions.filter((session) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= cutoffDate;
      });
    } catch (error) {
                  // Error handled silently
      return [];
    }
  }

  async updateFocusScore(sessionId: string, score: number): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (session) {
        session.focusScore = score;
        await this.saveSession(session);
      }
    } catch (error) {
                  // Error handled silently
    }
  }

  async markTreeSurvived(sessionId: string, survived: boolean): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (session) {
        session.treeSurvived = survived;
        await this.saveSession(session);
      }
    } catch (error) {
                  // Error handled silently
    }
  }

  // Active state management
  private async saveActiveState(state: ActiveTimerState): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state));
    } catch (error) {
                  // Error handled silently
    }
  }

  async loadActiveState(): Promise<ActiveTimerState | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
      if (data) {
        const state = JSON.parse(data) as ActiveTimerState;
        // Calculate elapsed time since last tick
        const elapsed = Math.floor((Date.now() - state.lastTick) / 1000);
        if (elapsed > 0 && state.remainingTime > 0) {
          state.remainingTime = Math.max(0, state.remainingTime - elapsed);
          state.lastTick = Date.now();
          // If timer completed while app was closed
          if (state.remainingTime <= 0) {
            await this.handleTimerComplete();
            return null;
          }
        }
        this.activeState = state;
        this.startTimer();
        return state;
      }
    } catch (error) {
                  // Error handled silently
    }
    return null;
  }

  // Listener management
  subscribe(listener: (state: ActiveTimerState | null) => void): () => void {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener(this.activeState || null);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.activeState || null);
    });
  }

  // Stats
  async getStats(days: number = 7): Promise<{
    totalSessions: number;
    totalStudyTime: number; // in minutes
    averageFocusScore: number;
    treesGrown: number;
  }> {
    try {
      const sessions = await this.getSessionHistory(days);
      const completedSessions = sessions.filter((s) => s.endTime);
      
      return {
        totalSessions: completedSessions.length,
        totalStudyTime: Math.floor(completedSessions.reduce((sum, s) => sum + (s.actualStudyTime / 60), 0)),
        averageFocusScore: completedSessions.length > 0
          ? Math.round(completedSessions.reduce((sum, s) => sum + s.focusScore, 0) / completedSessions.length)
          : 0,
        treesGrown: completedSessions.filter((s) => s.treeSurvived).length,
      };
    } catch (error) {
                  // Error handled silently
      return {
        totalSessions: 0,
        totalStudyTime: 0,
        averageFocusScore: 0,
        treesGrown: 0,
      };
    }
  }

  // Cleanup
  destroy(): void {
    this.stopTimer();
    this.listeners = [];
    this.activeState = null;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const timerService = new TimerService();
