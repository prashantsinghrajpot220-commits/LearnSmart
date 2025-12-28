import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTheme } from './ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export default function Skeleton({ width, height = 20, style }: SkeletonProps) {
  const { colors } = useTheme();
  const widthValue = width as any;

  return (
    <View
      style={[
        styles.skeleton,
        { width: widthValue, height, backgroundColor: colors.lightGray },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }, style]}>
      <View style={styles.cardContent}>
        <Skeleton width={48} height={48} style={styles.cardIcon} />
        <View style={styles.cardText}>
          <Skeleton width={160} height={16} style={styles.title} />
          <Skeleton width={120} height={14} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: BorderRadius.sm,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: Spacing.md,
  },
  cardText: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.sm,
  },
});
