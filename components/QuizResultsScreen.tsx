/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useQuizStore } from '@/store/quizStore';
import { Feather } from '@expo/vector-icons';

interface QuizResultsScreenProps {
  onRetry?: () => void;
  onBackToLesson?: () => void;
}

export default function QuizResultsScreen({
  onRetry,
  onBackToLesson,
}: QuizResultsScreenProps) {
  const { colors, isDark } = useTheme();
  const { questions, score, selectedAnswers } = useQuizStore();

  const animationProgress = useMemo(() => new Animated.Value(0), []);
  const scaleValue = useMemo(() => new Animated.Value(0.8), []);
  const confettiAnimations = useMemo(
    () => Array.from({ length: 12 }, () => new Animated.Value(0)),
    []
  );

  const correctCount = questions.filter(
    (q, i) => selectedAnswers[i] === q.correctAnswer
  ).length;
  const incorrectCount = questions.length - correctCount;
  const isHighScore = score >= 70;

  // Memoize animated values that are used in render
  const contentOpacity = animationProgress;
  const scoreScale = useMemo(() => 
    animationProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1.1, 1],
    }), [animationProgress]
  );

  const celebrationScale = useMemo(() =>
    animationProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1.2, 1],
    }), [animationProgress]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
    ]).start();

    if (isHighScore) {
      Animated.stagger(150, confettiAnimations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      )).start();
    }
  }, [isHighScore, animationProgress, scaleValue, confettiAnimations]);

  const handleRetry = () => {
    onRetry?.();
  };

  const handleBackToLesson = () => {
    onBackToLesson?.();
  };

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {isHighScore && confettiAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              left: `${(index * 8 + 5) % 90}%`,
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 60],
                  }),
                },
                {
                  rotate: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${(index % 2 === 0 ? 45 : -45)}deg`],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          {isHighScore ? (
            <>
              <Animated.View
                style={[
                  styles.celebrationCircle,
                  {
                    transform: [{ scale: celebrationScale }],
                  },
                ]}
              >
                <Feather name="award" size={64} color="#FFFFFF" />
              </Animated.View>
              <Animated.Text style={styles.celebrationEmoji}>
                🎉
              </Animated.Text>
            </>
          ) : (
            <View style={styles.resultCircle}>
              <Feather name="rotate-ccw" size={48} color={colors.primary} />
            </View>
          )}
        </View>

        <Text style={styles.title}>
          {isHighScore ? 'Amazing Job!' : 'Quiz Complete!'}
        </Text>

        <Animated.View
          style={[
            styles.scoreContainer,
            {
              transform: [{ scale: scoreScale }],
            },
          ]}
        >
          <Text style={styles.scoreText}>{score}%</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </Animated.View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.correctIcon]}>
              <Feather name="check" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{correctCount}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.incorrectIcon]}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{incorrectCount}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
        </View>

        <Text style={styles.encouragement}>
          {isHighScore
            ? "Outstanding performance! You've mastered this topic!"
            : score >= 50
            ? 'Good effort! Review the material and try again!'
            : 'Keep learning! Practice makes perfect!'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Feather name="rotate-ccw" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBackToLesson}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Back to Lesson</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
    },
    confetti: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
      top: -20,
    },
    content: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    iconContainer: {
      position: 'relative',
      marginBottom: Spacing.xl,
    },
    celebrationCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    resultCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    celebrationEmoji: {
      position: 'absolute',
      fontSize: 32,
      bottom: -10,
      right: -10,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: isDark ? colors.text : colors.charcoal,
      marginBottom: Spacing.xl,
      textAlign: 'center',
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
      padding: Spacing.xl,
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      minWidth: 160,
    },
    scoreText: {
      fontSize: 56,
      fontWeight: FontWeights.bold,
      color: colors.primary,
    },
    scoreLabel: {
      fontSize: FontSizes.lg,
      color: colors.textSecondary,
      fontWeight: FontWeights.medium,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
      width: '100%',
    },
    statCard: {
      alignItems: 'center',
      padding: Spacing.lg,
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      marginHorizontal: Spacing.md,
      minWidth: 100,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    correctIcon: {
      backgroundColor: colors.primary,
    },
    incorrectIcon: {
      backgroundColor: '#E07856',
    },
    statValue: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: isDark ? colors.text : colors.charcoal,
    },
    statLabel: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
    encouragement: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
      lineHeight: FontSizes.md * 1.5,
      paddingHorizontal: Spacing.lg,
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 320,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      minHeight: 56,
    },
    retryButton: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    retryButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: '#FFFFFF',
      marginLeft: Spacing.sm,
    },
    backButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    backButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.primary,
      marginLeft: Spacing.sm,
    },
  });
