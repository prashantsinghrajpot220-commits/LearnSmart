import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useXPStore } from './xpStore';
import { useAchievementStore } from './achievementStore';
import { coinRewardService } from '@/services/CoinRewardService';
import type { QuizQuestion, DifficultyLevel, QuizResult, MistakeRecord } from '@/types/quiz';
import { mistakeAnalysisService } from '@/services/MistakeAnalysisService';

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  isQuizActive: boolean;
  isLoading: boolean;
  error: string | null;
  score: number;
  currentDifficulty: DifficultyLevel;
  quizStartTime: number | null;
  quizTopic: string;
  quizSubject: string;
  quizChapter: string;
  
  // Actions
  setQuestions: (questions: QuizQuestion[], topic: string, subject: string, chapter: string) => void;
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  startQuiz: () => void;
  endQuiz: () => Promise<QuizResult | null>;
  resetQuiz: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  updateAdaptiveDifficulty: () => DifficultyLevel;
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
  currentDifficulty: 'medium',
  quizStartTime: null,
  quizTopic: '',
  quizSubject: '',
  quizChapter: '',

  setQuestions: (questions, topic, subject, chapter) => {
    set({
      questions,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      score: 0,
      isQuizActive: true,
      error: null,
      quizTopic: topic,
      quizSubject: subject,
      quizChapter: chapter,
      quizStartTime: Date.now(),
      currentDifficulty: questions[0]?.difficulty || 'medium',
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
    const { calculateScore, questions, selectedAnswers, quizStartTime, quizTopic, quizSubject, quizChapter } = get();
    const score = calculateScore();
    const endTime = Date.now();
    const timeSpent = quizStartTime ? (endTime - quizStartTime) / 1000 : 0;
    
    set({
      isQuizActive: false,
      score,
    });

    // Record mistakes for analysis
    try {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = selectedAnswers[i];
        
        if (userAnswer !== undefined && userAnswer !== question.correctAnswer) {
          const mistake: MistakeRecord = {
            id: `mistake_${Date.now()}_${i}`,
            questionId: question.id,
            question: question.question,
            userAnswer,
            correctAnswer: question.correctAnswer,
            topic: question.topic,
            subject: quizSubject,
            chapter: quizChapter,
            timestamp: Date.now(),
            explanation: question.explanation,
          };
          await mistakeAnalysisService.recordMistake(mistake);
        }
      }
    } catch (error) {
                  // Debug statement removed
    }

    // Record quiz result
    try {
      const quizResult: QuizResult = {
        quizId: `quiz_${Date.now()}`,
        score,
        totalQuestions: questions.length,
        correctAnswers: questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length,
        wrongAnswers: questions.filter((q, i) => selectedAnswers[i] !== undefined && selectedAnswers[i] !== q.correctAnswer).length,
        timestamp: Date.now(),
        timeSpent,
        difficulty: get().currentDifficulty,
        topic: quizTopic,
        subject: quizSubject,
        chapter: quizChapter,
      };
      await mistakeAnalysisService.recordQuizResult(quizResult);
    } catch (error) {
                  // Debug statement removed
    }

    // Award XP and SmartCoins for completing a quiz
    try {
      const { addXP, incrementQuizzesCompleted, getXP } = useXPStore.getState();
      const { checkAndUnlock } = useAchievementStore.getState();
      
      await addXP(QUIZ_XP_AMOUNT);
      incrementQuizzesCompleted();
      
      // Award SmartCoins for quiz completion
      const correctCount = get().questions.filter(
        (q, i) => get().selectedAnswers[i] === q.correctAnswer
      ).length;
      await coinRewardService.rewardQuizCompletion(correctCount, get().questions.length);
      
      // Check for quiz and XP achievements
      const { totalQuizzesCompleted, totalLessonsRead } = useXPStore.getState();
      checkAndUnlock({
        currentStreak: 0, // Will be updated from streak service
        totalQuizzesCompleted,
        totalLessonsRead,
        currentXP: getXP(),
        rank: useXPStore.getState().getRank().name,
      });

      // Return quiz result for analytics
      return {
        quizId: `quiz_${Date.now()}`,
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: questions.length - correctCount,
        timestamp: Date.now(),
        timeSpent,
        difficulty: get().currentDifficulty,
        topic: quizTopic,
        subject: quizSubject,
        chapter: quizChapter,
      };
    } catch (error) {
                  // Debug statement removed
      return null;
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
      currentDifficulty: 'medium',
      quizStartTime: null,
      quizTopic: '',
      quizSubject: '',
      quizChapter: '',
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

  setDifficulty: (difficulty) => {
    set({ currentDifficulty: difficulty });
  },

  updateAdaptiveDifficulty: () => {
    const { calculateScore } = get();
    const score = calculateScore();
    
    let newDifficulty: DifficultyLevel = 'medium';
    if (score >= 80) {
      newDifficulty = 'hard';
    } else if (score < 60) {
      newDifficulty = 'easy';
    }
    
    set({ currentDifficulty: newDifficulty });
    return newDifficulty;
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

export type { QuizQuestion, DifficultyLevel, QuizResult, MistakeRecord };
