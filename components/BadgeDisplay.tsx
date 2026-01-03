import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Badge } from '@/store/userStore';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
}

export default function BadgeDisplay({ badge, size = 'md' }: BadgeDisplayProps) {
  const { colors } = useTheme();

  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 32;
  const containerSize = size === 'sm' ? 40 : size === 'lg' ? 80 : 56;
  const fontSize = size === 'sm' ? FontSizes.xs : size === 'lg' ? FontSizes.md : FontSizes.sm;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            backgroundColor: colors.cardBackground,
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={{ fontSize: iconSize }}>{badge.icon}</Text>
      </View>
      <Text style={[styles.name, { fontSize, color: colors.text }]}>{badge.name}</Text>
      {size !== 'sm' && (
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    textAlign: 'center',
  },
});
