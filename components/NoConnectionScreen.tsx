import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NoConnectionScreenProps {
  onRetry?: () => void;
  message?: string;
}

export default function NoConnectionScreen({
  onRetry,
  message = 'Check your internet connection and try again',
}: NoConnectionScreenProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Feather name="wifi-off" size={48} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>No Connection</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick tips:</Text>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={styles.tipText}>Check if Wi-Fi or mobile data is on</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={styles.tipText}>Move to an area with better signal</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={styles.tipText}>Restart your device if needed</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Feather name="refresh-cw" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Once you are back online, this screen will disappear automatically.
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    content: { width: '100%', maxWidth: 400, alignItems: 'center' },
    iconContainer: { marginBottom: Spacing.xl },
    iconBackground: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
      borderStyle: 'dashed' as const,
    },
    title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: colors.text, marginBottom: Spacing.md, textAlign: 'center' },
    message: { fontSize: FontSizes.md, color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: FontSizes.md * 1.5 },
    tipsContainer: { width: '100%', backgroundColor: colors.cardBackground, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.xl },
    tipsTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: colors.text, marginBottom: Spacing.md },
    tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    tipText: { fontSize: FontSizes.sm, color: colors.textSecondary, marginLeft: Spacing.sm, flex: 1 },
    retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, minWidth: 160, minHeight: 56 },
    retryButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: '#FFFFFF', marginLeft: Spacing.sm },
    helpText: { fontSize: FontSizes.xs, color: colors.textSecondary, textAlign: 'center', opacity: 0.7, lineHeight: FontSizes.xs * 1.4 },
  });

// Connected State Screen (when connection is restored)
export function ConnectionRestoredScreen({ onContinue }: { onContinue?: () => void }) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBackground}>
          <Feather name="wifi" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>You are Back Online!</Text>
        <Text style={styles.message}>Your connection has been restored.</Text>

        <TouchableOpacity style={styles.retryButton} onPress={onContinue} activeOpacity={0.8}>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
