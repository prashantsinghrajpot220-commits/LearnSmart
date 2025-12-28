import { create } from 'zustand';

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
  endQuiz: () => void;
  resetQuiz: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
}

const MAX_QUESTIONS = 5;

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

  endQuiz: () => {
    const { calculateScore } = get();
    set({
      isQuizActive: false,
      score: calculateScore(),
    });
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
    set({ error });
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
