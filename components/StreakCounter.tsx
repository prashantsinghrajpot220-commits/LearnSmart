import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface StreakCounterProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  streakCount?: number;
}

export default function StreakCounter({
  size = 'medium',
  showLabel = true,
  streakCount: externalStreakCount,
}: StreakCounterProps) {
  const { colors } = useTheme();
  const { answerStreakCount } = useUserStore();
  const streakCount = externalStreakCount ?? answerStreakCount;

  const sizeStyles = {
    small: {
      icon: 20,
      text: FontSizes.sm,
      padding: Spacing.xs,
    },
    medium: {
      icon: 24,
      text: FontSizes.md,
      padding: Spacing.sm,
    },
    large: {
      icon: 32,
      text: FontSizes.xl,
      padding: Spacing.md,
    },
  };

  const currentSize = sizeStyles[size];
  const flameColor = streakCount > 0 ? '#FF6B35' : '#9CA3AF';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: streakCount > 0 ? colors.cardBackground : colors.cardBackground + '80',
          padding: currentSize.padding,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="fire"
        size={currentSize.icon}
        color={flameColor}
      />
      <Text
        style={[
          styles.count,
          {
            color: streakCount > 0 ? colors.text : colors.textSecondary,
            fontSize: currentSize.text,
          },
        ]}
      >
        {streakCount}
      </Text>
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: size === 'small' ? FontSizes.xs : FontSizes.sm,
            },
          ]}
        >
          {streakCount === 1 ? 'day' : 'days'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  count: {
    fontWeight: FontWeights.bold,
  },
  label: {
    fontWeight: FontWeights.medium,
  },
});
