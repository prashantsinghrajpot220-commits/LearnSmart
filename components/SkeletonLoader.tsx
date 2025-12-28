import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Dimensions } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTheme } from './ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height: number;
  style?: ViewStyle;
  borderRadius?: number;
}

export default function Skeleton({
  width = '100%',
  height,
  style,
  borderRadius = BorderRadius.sm,
}: SkeletonProps) {
  const { colors } = useTheme();

  const animatedValue = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const widthValue = typeof width === 'number' ? width : '100%';

  return (
    <View
      style={[
        styles.skeleton,
        {
          width: widthValue,
          height,
          borderRadius,
          backgroundColor: colors.lightGray,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: SCREEN_WIDTH,
            height: height + 40,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

interface QuestionSkeletonProps {
  style?: ViewStyle;
}

export function QuestionSkeleton({ style }: QuestionSkeletonProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.questionSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <Skeleton width={120} height={20} style={styles.questionNumber} />
      <View style={styles.questionTextContainer}>
        <Skeleton width="100%" height={24} style={styles.questionLine} />
        <Skeleton width="85%" height={24} style={styles.questionLine} />
      </View>
      <View style={styles.optionsContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.optionRow}>
            <Skeleton width={28} height={28} borderRadius={14} style={styles.optionCircle} />
            <Skeleton
              width={i === 2 || i === 3 ? '70%' : '85%'}
              height={20}
              style={styles.optionText}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

interface CardSkeletonProps {
  style?: ViewStyle;
}

export function CardSkeleton({ style }: CardSkeletonProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.cardSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={48} height={48} borderRadius={12} style={styles.cardIcon} />
        <View style={styles.cardTextContainer}>
          <Skeleton width={160} height={18} style={styles.cardTitle} />
          <Skeleton width={100} height={14} style={styles.cardSubtitle} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <Skeleton width="100%" height={12} style={styles.cardLine} />
        <Skeleton width="90%" height={12} style={styles.cardLine} />
        <Skeleton width="75%" height={12} style={styles.cardLine} />
      </View>
    </View>
  );
}

interface TextSkeletonProps {
  lines?: number;
  lineWidth?: number[];
  style?: ViewStyle;
}

export function TextSkeleton({ lines = 3, lineWidth = [100, 85, 70], style }: TextSkeletonProps) {
  return (
    <View style={[styles.textSkeleton, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={lineWidth[index] ?? 100}
          height={16}
          style={styles.textLine}
        />
      ))}
    </View>
  );
}

interface ChatMessageSkeletonProps {
  style?: ViewStyle;
}

export function ChatMessageSkeleton({ style }: ChatMessageSkeletonProps) {
  return (
    <View style={[styles.chatMessageSkeleton, style]}>
      <View style={styles.chatHeader}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={60} height={12} style={styles.chatName} />
      </View>
      <View style={styles.chatTextLines}>
        <Skeleton width="100%" height={14} style={styles.chatLine} />
        <Skeleton width="80%" height={14} style={styles.chatLine} />
      </View>
    </View>
  );
}

interface QuizResultsSkeletonProps {
  style?: ViewStyle;
}

export function QuizResultsSkeleton({ style }: QuizResultsSkeletonProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.resultsSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <Skeleton width={120} height={120} borderRadius={60} style={styles.scoreCircle} />
      <Skeleton width={200} height={28} style={styles.scoreText} />
      <Skeleton width={150} height={20} style={styles.scoreLabel} />
      <View style={styles.resultsStats}>
        <Skeleton width={100} height={60} borderRadius={12} style={styles.statCard} />
        <Skeleton width={100} height={60} borderRadius={12} style={styles.statCard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: -20,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  questionSkeleton: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  questionNumber: {
    marginBottom: Spacing.md,
  },
  questionTextContainer: {
    marginBottom: Spacing.lg,
  },
  questionLine: {
    marginBottom: Spacing.sm,
  },
  optionsContainer: {
    marginTop: Spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  optionCircle: {
    marginRight: Spacing.md,
  },
  optionText: {
    marginLeft: Spacing.sm,
  },
  cardSkeleton: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIcon: {
    marginRight: Spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {},
  cardBody: {
    marginTop: Spacing.sm,
  },
  cardLine: {
    marginBottom: Spacing.sm,
  },
  textSkeleton: {},
  textLine: {
    marginBottom: Spacing.sm,
  },
  chatMessageSkeleton: {
    padding: Spacing.md,
    maxWidth: '80%',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chatName: {
    marginLeft: Spacing.sm,
  },
  chatTextLines: {},
  chatLine: {
    marginBottom: Spacing.xs,
  },
  resultsSkeleton: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  scoreCircle: {
    marginBottom: Spacing.lg,
  },
  scoreText: {
    marginBottom: Spacing.sm,
  },
  scoreLabel: {
    marginBottom: Spacing.xl,
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    marginHorizontal: Spacing.sm,
  },
});
