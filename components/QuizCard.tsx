import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { QuizQuestion, useQuizStore, useQuizProgress, useIsQuestionAnswered } from '@/store/quizStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface OptionStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onPrevious,
}: QuizCardProps) {
  const { colors, isDark } = useTheme();
  const { selectAnswer, selectedAnswers } = useQuizStore();
  const { isLastQuestion } = useQuizProgress();
  const isAnswered = useIsQuestionAnswered(questionNumber - 1);
  
  const [animationState] = useState({
    scale: new Animated.Value(1),
    translateX: new Animated.Value(0),
    opacity: new Animated.Value(1),
    feedbackOpacity: new Animated.Value(0),
  });

  const handleOptionPress = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;

      // Animate button press
      Animated.sequence([
        Animated.timing(animationState.scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animationState.scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Select answer
      selectAnswer(questionNumber - 1, optionIndex);

      // Show feedback animation
      Animated.sequence([
        Animated.timing(animationState.feedbackOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animationState.feedbackOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [isAnswered, questionNumber, selectAnswer, animationState]
  );

  const handleSwipeLeft = useCallback(() => {
    if (!isLastQuestion && isAnswered) {
      runOnJS(onNext ?? (() => {}))();
    }
  }, [isLastQuestion, isAnswered, onNext]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isAnswered) return;
      
      const { translationX } = event;
      animationState.translateX.setValue(translationX);
      
      // Calculate swipe progress
      const progress = Math.min(Math.abs(translationX) / SWIPE_THRESHOLD, 1);
      animationState.opacity.setValue(1 - progress * 0.3);
    })
    .onEnd((event) => {
      if (!isAnswered) {
        animationState.translateX.setValue(0);
        animationState.opacity.setValue(1);
        return;
      }

      const { translationX } = event;
      
      if (translationX < -SWIPE_THRESHOLD && !isLastQuestion) {
        Animated.timing(animationState.translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          animationState.translateX.setValue(0);
          animationState.opacity.setValue(1);
          runOnJS(handleSwipeLeft)();
        });
      } else {
        Animated.parallel([
          Animated.spring(animationState.translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(animationState.opacity, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

  const getOptionStyle = (index: number): OptionStyle => {
    const isSelected = selectedAnswers[questionNumber - 1] === index;
    const isCorrect = question.correctAnswer === index;
    const showFeedback = isAnswered;

    let backgroundColor = colors.cardBackground;
    let borderColor = colors.lightGray;
    let textColor = colors.text;

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = isDark ? '#1E3D2A' : '#E8F5E9';
        borderColor = colors.primary;
        textColor = isDark ? '#A8D5BA' : '#2E7D32';
      } else if (isSelected && !isCorrect) {
        backgroundColor = isDark ? '#3D1E1E' : '#FFEBEE';
        borderColor = '#E07856';
        textColor = isDark ? '#F5A5A5' : '#C62828';
      }
    } else if (isSelected) {
      backgroundColor = isDark ? '#2A3D2A' : '#F5F1E8';
      borderColor = colors.primary;
      textColor = colors.primary;
    }

    return { backgroundColor, borderColor, textColor };
  };

  const styles = getStyles(colors, isDark);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: animationState.translateX },
              { scale: animationState.scale },
            ],
            opacity: animationState.opacity,
          },
        ]}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${(questionNumber / totalQuestions) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {questionNumber} of {totalQuestions}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const optionStyle = getOptionStyle(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: optionStyle.backgroundColor,
                    borderColor: optionStyle.borderColor,
                  },
                ]}
                onPress={(e: GestureResponderEvent) => handleOptionPress(index)}
                disabled={isAnswered}
                activeOpacity={isAnswered ? 1 : 0.8}
              >
                <View
                  style={[
                    styles.optionIndicator,
                    {
                      backgroundColor: optionStyle.backgroundColor,
                      borderColor: optionStyle.borderColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      { color: isAnswered && question.correctAnswer === index ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: optionStyle.textColor }]}>
                  {option}
                </Text>
                {isAnswered && question.correctAnswer === index && (
                  <Text style={styles.correctIcon}>✓</Text>
                )}
                {isAnswered && selectedAnswers[questionNumber - 1] === index && question.correctAnswer !== index && (
                  <Text style={styles.wrongIcon}>✗</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback/Explanation */}
        {isAnswered && (
          <Animated.View
            style={[
              styles.explanationContainer,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                opacity: animationState.feedbackOpacity,
              },
            ]}
          >
            <Text style={styles.explanationTitle}>
              {selectedAnswers[questionNumber - 1] === question.correctAnswer
                ? '✓ Correct!'
                : '✗ Not quite right'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </Animated.View>
        )}

        {/* Swipe hint */}
        {isAnswered && !isLastQuestion && (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>← Swipe left for next question</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    progressContainer: {
      marginBottom: Spacing.lg,
    },
    progressBackground: {
      height: 8,
      backgroundColor: colors.lightGray,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
      textAlign: 'center',
    },
    questionContainer: {
      marginBottom: Spacing.xl,
    },
    questionText: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      color: isDark ? colors.text : colors.charcoal,
      lineHeight: FontSizes.lg * 1.4,
    },
    optionsContainer: {
      flex: 1,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      marginBottom: Spacing.md,
      minHeight: 56,
    },
    optionIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    optionLetter: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.bold,
    },
    optionText: {
      flex: 1,
      fontSize: FontSizes.md,
      lineHeight: FontSizes.md * 1.4,
    },
    correctIcon: {
      fontSize: FontSizes.lg,
      color: colors.primary,
      marginLeft: Spacing.sm,
    },
    wrongIcon: {
      fontSize: FontSizes.lg,
      color: '#E07856',
      marginLeft: Spacing.sm,
    },
    explanationContainer: {
      marginTop: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    explanationTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.primary,
      marginBottom: Spacing.sm,
    },
    explanationText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: FontSizes.sm * 1.5,
    },
    swipeHint: {
      alignItems: 'center',
      marginTop: Spacing.md,
      padding: Spacing.sm,
    },
    swipeHintText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      opacity: 0.7,
    },
  });
