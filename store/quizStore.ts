import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useXPStore } from './xpStore';
import { useAchievementStore } from './achievementStore';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  isQuizActive: boolean;
  isLoading: boolean;
  error: string | null;
  score: number;
  
  // Actions
  setQuestions: (questions: QuizQuestion[]) => void;
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  startQuiz: () => void;
  endQuiz: () => Promise<void>;
  resetQuiz: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
}

const MAX_QUESTIONS = 5;

const QUIZ_XP_AMOUNT = 50;

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  isQuizActive: false,
  isLoading: false,
  error: null,
  score: 0,

  setQuestions: (questions) => {
    set({
      questions,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      score: 0,
      isQuizActive: true,
      error: null,
    });
  },

  selectAnswer: (questionIndex, answerIndex) => {
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionIndex]: answerIndex,
      },
    }));
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  startQuiz: () => {
    set({
      isQuizActive: true,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      error: null,
    });
  },

  endQuiz: async () => {
    const { calculateScore } = get();
    const score = calculateScore();
    
    set({
      isQuizActive: false,
      score,
    });

    // Award XP for completing a quiz
    try {
      const { addXP, incrementQuizzesCompleted, getXP } = useXPStore.getState();
      const { checkAndUnlock } = useAchievementStore.getState();
      
      await addXP(QUIZ_XP_AMOUNT);
      incrementQuizzesCompleted();
      
      // Check for quiz and XP achievements
      const { totalQuizzesCompleted, totalLessonsRead } = useXPStore.getState();
      checkAndUnlock({
        currentStreak: 0, // Will be updated from streak service
        totalQuizzesCompleted,
        totalLessonsRead,
        currentXP: getXP(),
        rank: useXPStore.getState().getRank().name,
      });
    } catch (error) {
      console.error('Failed to award XP for quiz:', error);
    }
  },

  resetQuiz: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isQuizActive: false,
      isLoading: false,
      error: null,
      score: 0,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error: error });
  },

  calculateScore: () => {
    const { questions, selectedAnswers } = get();
    if (questions.length === 0) return 0;

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    return Math.round((correctCount / questions.length) * 100);
  },
}));

// Selector hooks for derived state
export const useCurrentQuestion = () => {
  const { questions, currentQuestionIndex } = useQuizStore();
  return questions[currentQuestionIndex];
};

export const useQuizProgress = () => {
  const { questions, currentQuestionIndex, selectedAnswers } = useQuizStore();
  return {
    current: currentQuestionIndex + 1,
    total: questions.length,
    answeredCount: Object.keys(selectedAnswers).length,
    isLastQuestion: currentQuestionIndex === questions.length - 1,
  };
};

export const useIsQuestionAnswered = (questionIndex: number) => {
  const selectedAnswers = useQuizStore((state) => state.selectedAnswers);
  return selectedAnswers[questionIndex] !== undefined;
};

// XP constants
export const QUIZ_COMPLETE_XP = QUIZ_XP_AMOUNT;
export const LESSON_READ_XP = 10;
