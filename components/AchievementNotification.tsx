import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';

interface AchievementNotificationProps {
  achievementName: string;
  achievementIcon: string;
  visible: boolean;
  onHide: () => void;
}

export default function AchievementNotification({
  achievementName,
  achievementIcon,
  visible,
  onHide,
}: AchievementNotificationProps) {
  const { colors, isDark } = useTheme();
  const translateY = useMemo(() => new Animated.Value(-100), []);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const scale = useMemo(() => new Animated.Value(0.8), []);

  const hideNotification = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [opacity, onHide, translateY]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hideNotification, opacity, scale, translateY, visible]);

  const styles = getStyles(colors, isDark);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{achievementIcon}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Feather name="award" size={14} color={colors.primary} />
            <Text style={styles.label}>Achievement Unlocked!</Text>
          </View>
          <Text style={styles.achievementName}>{achievementName}</Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
          <Feather name="x" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.select({ web: 20, default: 60 }),
      left: Spacing.lg,
      right: Spacing.lg,
      zIndex: 1000,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    icon: {
      fontSize: 28,
    },
    textContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    label: {
      fontSize: FontSizes.xs,
      color: colors.primary,
      fontWeight: FontWeights.semibold,
      marginLeft: Spacing.xs,
    },
    achievementName: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    closeButton: {
      padding: Spacing.xs,
    },
  });
