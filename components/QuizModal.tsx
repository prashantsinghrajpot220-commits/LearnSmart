import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useQuizStore } from '@/store/quizStore';
import { useUserStore } from '@/store/userStore';
import { generateQuizQuestions } from '@/services/quizGenerator';
import { checkNetworkConnectivity } from '@/services/networkService';
import { ContentValidator } from '@/services/ContentValidator';
import QuizCard from './QuizCard';
import QuizResultsScreen from './QuizResultsScreen';
import { QuestionSkeleton } from './SkeletonLoader';
import NoConnectionScreen from './NoConnectionScreen';
import { Feather } from '@expo/vector-icons';
import AdContainer from './AdContainer';
import { AD_UNIT_IDS } from '@/config/adConfig';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  className: string;
  subject: string;
  chapter: string;
}

export default function QuizModal({
  visible,
  onClose,
  className,
  subject,
  chapter,
}: QuizModalProps) {
  const { colors } = useTheme();
  const ageGroup = useUserStore((s) => s.ageGroup) ?? 'under12';
  const {
    questions,
    isQuizActive,
    isLoading,
    error,
    currentQuestionIndex,
    resetQuiz,
    setQuestions,
    setLoading,
    setError,
  } = useQuizStore();
  const [isConnected, setIsConnected] = useState(true);
  const [slideAnim] = useState(new Animated.Value(MODAL_HEIGHT));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleLoadQuiz = useCallback(async () => {
    const connected = await checkNetworkConnectivity();
    setIsConnected(connected);

    if (!connected) return;

    setLoading(true);
    try {
      const quizQuestions = await generateQuizQuestions(className, subject, chapter);

      const safeQuestions = await ContentValidator.validateQuizQuestions(quizQuestions, {
        contentId: `quiz:${className}:${subject}:${chapter}`,
        ageGroup,
        source: 'QuizModal',
      });

      if (safeQuestions.length === 0) {
        throw new Error('Quiz content is unavailable right now.');
      }

      setQuestions(safeQuestions, chapter, subject, chapter);
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [className, subject, chapter, ageGroup, setQuestions, setLoading, setError]);

  useEffect(() => {
    if (visible && questions.length === 0 && !error) {
      handleLoadQuiz();
    }
  }, [visible, questions.length, error, handleLoadQuiz]);

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: MODAL_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      resetQuiz();
      onClose();
    });
  }, [slideAnim, resetQuiz, onClose]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleLoadQuiz();
  }, [handleLoadQuiz, setError]);

  const handleNext = useCallback(() => {
    const { nextQuestion } = useQuizStore.getState();
    nextQuestion();
  }, []);

  const handlePrevious = useCallback(() => {
    const { previousQuestion } = useQuizStore.getState();
    previousQuestion();
  }, []);

  const handleBackToLesson = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const currentQuestion = questions[currentQuestionIndex];

  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View style={styles.chip}>
                    <Feather name="book-open" size={14} color="#FFFFFF" />
                    <Text style={styles.chipText}>{subject}</Text>
                  </View>
                  <Text style={styles.chapterTitle}>{chapter}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {!isConnected ? (
                  <NoConnectionScreen
                    onRetry={handleRetry}
                    message="Check your internet connection to load quiz questions."
                  />
                ) : isLoading ? (
                  <View style={styles.loadingContainer}>
                    <QuestionSkeleton />
                    <QuestionSkeleton />
                    <QuestionSkeleton />
                  </View>
                ) : error ? (
                  <View style={styles.errorContainer}>
                    <Feather
                      name="alert-triangle"
                      size={48}
                      color={colors.error}
                    />
                    <Text style={styles.errorTitle}>Unable to Load Quiz</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={handleRetry}
                      activeOpacity={0.8}
                    >
                      <Feather name="refresh-cw" size={20} color="#FFFFFF" />
                      <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                  </View>
                ) : questions.length > 0 && isQuizActive && currentQuestion ? (
                  <QuizCard
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                ) : questions.length > 0 && !isQuizActive ? (
                  <>
                    <QuizResultsScreen
                      onRetry={handleRetry}
                      onBackToLesson={handleBackToLesson}
                    />
                    <AdContainer unitId={AD_UNIT_IDS.BANNER_QUIZ} />
                  </>
                ) : null}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      height: MODAL_HEIGHT,
      backgroundColor: colors.background,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    headerContent: {
      flex: 1,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '500' as const,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    chapterTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text,
    },
    closeButton: {
      padding: Spacing.sm,
      marginTop: -Spacing.sm,
      marginRight: -Spacing.sm,
    },
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    loadingContainer: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    errorMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg,
      minWidth: 160,
      minHeight: 56,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      marginLeft: 8,
    },
  });
