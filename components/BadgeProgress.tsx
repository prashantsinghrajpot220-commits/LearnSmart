import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { AchievementProgress } from '@/store/userStore';

interface BadgeProgressProps {
  progress: AchievementProgress;
}

export default function BadgeProgress({ progress }: BadgeProgressProps) {
  const { colors } = useTheme();
  const percent = Math.min(100, (progress.currentValue / progress.targetValue) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{progress.name}</Text>
        <Text style={[styles.values, { color: colors.textSecondary }]}>
          {progress.currentValue} / {progress.targetValue}
        </Text>
      </View>
      <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percent}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  values: {
    fontSize: FontSizes.xs,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
