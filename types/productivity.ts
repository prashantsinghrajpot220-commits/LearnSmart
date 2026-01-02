export type TimerPhase = 'study' | 'break' | 'paused';

export interface PomodoroSession {
  id: string;
  studyDuration: number; // in minutes
  breakDuration: number; // in minutes
  actualStudyTime: number; // in seconds
  focusScore: number; // 0-100 based on how well they maintained focus
  phase: TimerPhase;
  subject?: string;
  chapter?: string;
  treeSurvived: boolean;
  startTime: string;
  endTime?: string;
}

export interface TimerSettings {
  studyDuration: number; // default 25
  breakDuration: number; // default 5
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoStartBreak: boolean;
  autoStartStudy: boolean;
}

export interface Tree {
  id: string;
  type: 'oak' | 'pine' | 'cherry' | 'willow' | 'maple';
  growth: number; // 0-100
  alive: boolean;
  plantedAt: string;
  sessionId: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string; // ISO date string
  dateDisplay: string; // Formatted date for display
  color: 'green' | 'yellow' | 'red';
  completed: boolean;
  isPrePopulated?: boolean;
  studyMaterials?: string[];
}

export interface BreakActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number; // suggested duration in minutes
  category: 'physical' | 'mental' | 'creative' | 'social';
}

export interface ForestStats {
  totalTrees: number;
  treesThisWeek: number;
  treesThisMonth: number;
  forestScore: number;
}
