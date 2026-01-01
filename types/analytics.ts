export interface PerformanceMetrics {
  overallAccuracy: number;
  quizzesTaken: number;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  averageScore: number;
  averageTimePerQuestion: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
}

export interface TopicPerformance {
  topic: string;
  subject: string;
  chapter: string;
  accuracy: number;
  questionsAttempted: number;
  averageTime: number;
  improvementRate: number;
  lastAttemptedAt: number;
  trend: 'up' | 'down' | 'stable';
}

export interface WeeklyReport {
  weekStart: number;
  weekEnd: number;
  quizzesTaken: number;
  lessonsRead: number;
  accuracy: number;
  xpGained: number;
  coinsEarned: number;
  timeSpent: number;
  improvementAreas: string[];
  strongAreas: string[];
}

export interface ComparisonData {
  userAccuracy: number;
  gradeLevelAverage: number;
  percentile: number;
  rankInClass: number;
  totalStudents: number;
}

export interface PerformanceChartData {
  labels: string[];
  accuracyData: number[];
  timeData: number[];
  difficultyProgression: {
    easy: number;
    medium: number;
    hard: number;
  };
}
