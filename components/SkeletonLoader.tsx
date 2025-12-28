import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export default function Skeleton({ width, height = 20, style }: SkeletonProps) {
  const widthValue = width as number | undefined;

  return (
    <View
      style={[
        styles.skeleton,
        { width: widthValue, height },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
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
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.sm,
  },
  card: {
    backgroundColor: Colors.white,
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
