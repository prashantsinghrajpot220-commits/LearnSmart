import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';

interface FloatingButtonProps {
  onPress: () => void;
}

export default function SmartyFloatingButton({ onPress }: FloatingButtonProps) {
  const { colors } = useTheme();
  const { isChatOpen } = useChatStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay visibility to avoid hydration issues
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const styles = getStyles(colors);

  if (isChatOpen || !isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel="Open Smarty Chat"
        accessibilityRole="button"
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarEmoji}>🎓</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Smarty</Text>
          <Text style={styles.subText}>Tap to chat</Text>
        </View>
        <View style={styles.pulseRing} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 24,
      right: 16,
      zIndex: 999,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.sm,
      paddingLeft: Spacing.sm,
      paddingRight: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 2,
      borderColor: colors.white,
    },
    avatarPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    avatarEmoji: {
      fontSize: 28,
    },
    textContainer: {
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: FontSizes.md,
      fontWeight: '700' as const,
      color: colors.white,
    },
    subText: {
      fontSize: 11,
      color: colors.white + 'CC',
      marginTop: 1,
    },
    pulseRing: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.primary + '50',
      right: 8,
      top: 8,
    },
  });
