import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, ThemeColors } from './ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { WeakArea } from '@/types/quiz';

interface WeakAreaCardProps {
  weakArea: WeakArea;
  rank: number;
}

export default function WeakAreaCard({ weakArea, rank }: WeakAreaCardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const styles = getStyles(colors, isDark);

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy < 40) return colors.error;
    if (accuracy < 55) return colors.warning;
    return colors.warning;
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getSeverityBadge = (accuracy: number): string => {
    if (accuracy < 40) return 'Needs Focus';
    if (accuracy < 55) return 'Needs Practice';
    return 'Review';
  };

  const handleFocus = () => {
    // Navigate to the lesson/chapter for this weak area
    router.push({
      pathname: '/chapters',
      params: {
        subject: weakArea.subject,
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.topic}>{weakArea.topic}</Text>
          <Text style={styles.context}>
            {weakArea.subject} • {weakArea.chapter}
          </Text>
        </View>
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>{getTrendIcon(weakArea.trend)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={[styles.statValue, { color: getAccuracyColor(weakArea.accuracy) }]}>
            {weakArea.accuracy}%
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Attempts</Text>
          <Text style={styles.statValue}>{weakArea.totalAttempts}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Mistakes</Text>
          <Text style={styles.statValue}>{weakArea.mistakes}</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${weakArea.accuracy}%`,
                backgroundColor: getAccuracyColor(weakArea.accuracy),
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>{getSeverityBadge(weakArea.accuracy)}</Text>
      </View>

      <TouchableOpacity style={styles.focusButton} onPress={handleFocus}>
        <Text style={styles.focusButtonText}>Focus on this topic →</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: colors.white,
  },
  headerContent: {
    flex: 1,
  },
  topic: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: 2,
  },
  context: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  trendContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIcon: {
    fontSize: FontSizes.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.lightGray,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: colors.textSecondary,
  },
  focusButton: {
    backgroundColor: colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  focusButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
});
