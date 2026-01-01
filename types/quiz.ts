export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  generatedAt: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timestamp: number;
  timeSpent: number;
  difficulty: DifficultyLevel;
  topic: string;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  topic: string;
  subject: string;
  chapter: string;
  timestamp: number;
  explanation: string;
}

export interface WeakArea {
  topic: string;
  subject: string;
  chapter: string;
  accuracy: number;
  totalAttempts: number;
  mistakes: number;
  trend: 'improving' | 'declining' | 'stable';
  recommendedLessons: string[];
}

export interface PersonalizedStudyPlan {
  weakAreas: WeakArea[];
  priorityTopics: string[];
  suggestedSchedule: StudyPlanDay[];
  estimatedCompletionDays: number;
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  subject: string;
  activities: string[];
  estimatedTime: number;
}

export interface QuizGenerationOptions {
  subject: string;
  chapter: string;
  lessonContent?: string;
  difficulty?: DifficultyLevel;
  questionCount?: number;
  topic?: string;
}
