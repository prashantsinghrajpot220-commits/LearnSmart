import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useCurrentRank } from '@/store/xpStore';

interface ProgressBarProps {
  showText?: boolean;
}

export default function ProgressBar({ showText = true }: ProgressBarProps) {
  const { colors, isDark } = useTheme();
  const { rank, progress, currentXP, xpToNext } = useCurrentRank();

  const animatedProgress = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [progress, animatedProgress]);

  const barWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const styles = getStyles(colors, isDark);
  const isMaxRank = !Number.isFinite(xpToNext) || xpToNext <= 0;
  const maxXP = isMaxRank ? currentXP : rank.maxXP;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankIcon}>{rank.icon}</Text>
          <Text style={styles.rankName}>{rank.name}</Text>
        </View>
        {showText && (
          <Text style={styles.xpText}>
            {currentXP} / {isMaxRank ? '∞' : maxXP} XP
          </Text>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: barWidth },
            ]}
          />
        </View>
      </View>
      
      {showText && !isMaxRank && (
        <Text style={styles.helperText}>
          {xpToNext} XP to {rank.name === 'Novice' ? 'Seeker' : rank.name === 'Seeker' ? 'Scholar' : 'Sage'}
        </Text>
      )}
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: Spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    rankIcon: {
      fontSize: 20,
      marginRight: Spacing.xs,
    },
    rankName: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: isDark ? colors.text : colors.charcoal,
    },
    xpText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      color: colors.textSecondary,
    },
    progressContainer: {
      width: '100%',
    },
    progressBackground: {
      height: 12,
      backgroundColor: colors.border,
      borderRadius: 6,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 6,
      minWidth: 4,
    },
    helperText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
      textAlign: 'right',
    },
  });
