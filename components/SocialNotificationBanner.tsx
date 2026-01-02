import React, { useCallback, useEffect, useMemo } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import type { AppNotification } from '@/store/notificationStore';

interface SocialNotificationBannerProps {
  notification: AppNotification;
  onDismiss: () => void;
}

function iconForType(type: AppNotification['type']): { name: keyof typeof Feather.glyphMap; label: string } {
  switch (type) {
    case 'group_invite':
      return { name: 'user-plus', label: 'Invite' };
    case 'group_message':
      return { name: 'message-circle', label: 'Message' };
    case 'group_quiz_created':
      return { name: 'clipboard', label: 'Quiz' };
    case 'group_quiz_result':
      return { name: 'award', label: 'Results' };
    default:
      return { name: 'bell', label: 'Notification' };
  }
}

export default function SocialNotificationBanner({ notification, onDismiss }: SocialNotificationBannerProps) {
  const { colors, isDark } = useTheme();
  const translateY = useMemo(() => new Animated.Value(-120), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -120, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => {
      onDismiss();
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 40 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      hide();
    }, 3500);

    return () => clearTimeout(timer);
  }, [hide, notification.id, opacity, translateY]);

  const styles = getStyles(colors, isDark);
  const icon = iconForType(notification.type);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name={icon.name} size={18} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hide}>
          <Feather name="x" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.select({ ios: 54, default: 16 }),
      left: Spacing.lg,
      right: Spacing.lg,
      zIndex: 2000,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 6,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 2,
    },
    message: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: FontSizes.sm * 1.35,
    },
    closeButton: {
      padding: Spacing.xs,
      marginLeft: Spacing.sm,
    },
  });
