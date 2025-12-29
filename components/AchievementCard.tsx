import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Achievement } from '@/store/achievementStore';

interface AchievementCardProps {
  achievement: Achievement;
  onPress?: () => void;
  showUnlockDate?: boolean;
  animateOnUnlock?: boolean;
}

export default function AchievementCard({
  achievement,
  onPress,
  showUnlockDate = true,
  animateOnUnlock = false,
}: AchievementCardProps) {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(achievement.unlocked ? 1 : 0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (achievement.unlocked && animateOnUnlock) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse glow effect
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [achievement.unlocked, animateOnUnlock, scaleAnim, glowAnim]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const styles = getStyles(colors, isDark, achievement.unlocked);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        achievement.unlocked && styles.containerUnlocked,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!achievement.unlocked}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            opacity: achievement.unlocked ? 1 : 0.5,
          },
        ]}
      >
        {achievement.unlocked && (
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
              },
            ]}
          />
        )}

        {!achievement.unlocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}

        <View
          style={[
            styles.iconContainer,
            achievement.unlocked && {
              backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            },
          ]}
        >
          <Text style={[styles.icon, !achievement.unlocked && styles.iconLocked]}>
            {achievement.icon}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, !achievement.unlocked && styles.textLocked]}>
            {achievement.name}
          </Text>
          <Text style={[styles.description, !achievement.unlocked && styles.textLocked]}>
            {achievement.description}
          </Text>
          
          {showUnlockDate && achievement.unlocked && achievement.unlockedDate && (
            <Text style={styles.unlockedDate}>
              Unlocked {formatDate(achievement.unlockedDate)}
            </Text>
          )}
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean, isUnlocked: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    containerUnlocked: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isUnlocked ? colors.primary : colors.lightGray,
    },
    glow: {
      position: 'absolute',
      top: -50,
      left: -50,
      right: -50,
      bottom: -50,
      backgroundColor: colors.primary,
      opacity: 0.1,
      borderRadius: 100,
    },
    lockOverlay: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      zIndex: 10,
    },
    lockIcon: {
      fontSize: 16,
      opacity: 0.6,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    icon: {
      fontSize: 32,
    },
    iconLocked: {
      opacity: 0.4,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: FontSizes.sm * 1.4,
    },
    textLocked: {
      opacity: 0.5,
    },
    unlockedDate: {
      fontSize: FontSizes.xs,
      color: colors.primary,
      marginTop: Spacing.xs,
      fontWeight: FontWeights.medium,
    },
    categoryBadge: {
      position: 'absolute',
      top: Spacing.sm,
      left: Spacing.sm,
      backgroundColor: colors.lightGray,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    categoryText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      fontWeight: FontWeights.medium,
    },
  });
