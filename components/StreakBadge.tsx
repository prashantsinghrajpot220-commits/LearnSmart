import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';

interface StreakBadgeProps {
  streak: number;
  showDetails?: boolean;
  onStreakPress?: () => void;
  animateOnChange?: boolean;
}

export default function StreakBadge({
  streak,
  showDetails = true,
  onStreakPress,
  animateOnChange = false,
}: StreakBadgeProps) {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animateOnChange && streak > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [streak, animateOnChange, scaleAnim]);

  const styles = getStyles(colors, isDark);

  const isZeroStreak = streak === 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isZeroStreak && styles.containerDisabled,
      ]}
      onPress={onStreakPress}
      activeOpacity={0.7}
      disabled={!onStreakPress}
    >
      <Animated.View
        style={[
          styles.badgeContent,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.iconContainer, isZeroStreak && styles.iconContainerDisabled]}>
          <Feather
            name="sun"
            size={24}
            color={isZeroStreak ? colors.textSecondary : '#FF8C42'}
          />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.streakRow}>
            <Text style={[styles.streakNumber, isZeroStreak && styles.textDisabled]}>
              {streak}
            </Text>
            <Text style={[styles.streakLabel, isZeroStreak && styles.textDisabled]}>
              {streak === 1 ? 'day' : 'days'}
            </Text>
          </View>
          
          {showDetails && !isZeroStreak && (
            <Text style={styles.streakMessage}>
              Keep it up! 🔥
            </Text>
          )}
          
          {isZeroStreak && (
            <Text style={[styles.streakMessage, styles.textDisabled]}>
              Start your streak!
            </Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    containerDisabled: {
      opacity: 0.8,
    },
    badgeContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#2A2A2A' : '#FFF5EB',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    iconContainerDisabled: {
      backgroundColor: colors.lightGray,
    },
    textContainer: {
      flex: 1,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    streakNumber: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: '#FF8C42',
      marginRight: Spacing.xs,
    },
    streakLabel: {
      fontSize: FontSizes.md,
      color: '#FF8C42',
      fontWeight: FontWeights.medium,
    },
    streakMessage: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    textDisabled: {
      color: colors.textSecondary,
    },
  });

// Freeze placeholder component
export function StreakFreeze() {
  const { colors, isDark } = useTheme();
  const styles = getFreezeStyles(colors, isDark);

  return (
    <View style={[styles.container, styles.freezeContainer]}>
      <View style={styles.freezeBadgeContent}>
        <View style={styles.freezeIconContainer}>
          <Feather name="cloud-snow" size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.freezeTextContainer}>
          <View style={styles.freezeRow}>
            <Text style={[styles.freezeTitle, styles.textDisabled]}>
              Streak Freeze
            </Text>
            <View style={styles.lockBadge}>
              <Feather name="lock" size={12} color={colors.textSecondary} />
            </View>
          </View>
          <Text style={[styles.freezeSubtitle, styles.textDisabled]}>
            Unlock with Premium
          </Text>
        </View>
      </View>
      <Text style={styles.freezeDescription}>
        Coming soon - protect your streak from breaks!
      </Text>
    </View>
  );
}

const getFreezeStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    freezeContainer: {
      marginTop: Spacing.md,
      backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9',
      borderStyle: 'dashed' as const,
      borderWidth: 2,
      borderColor: colors.lightGray,
    },
    freezeBadgeContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    freezeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    freezeTextContainer: {
      flex: 1,
    },
    freezeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    freezeTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
    },
    lockBadge: {
      marginLeft: Spacing.sm,
    },
    freezeSubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    freezeDescription: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: Spacing.sm,
      fontStyle: 'italic',
    },
    textDisabled: {
      opacity: 0.6,
    },
  });
