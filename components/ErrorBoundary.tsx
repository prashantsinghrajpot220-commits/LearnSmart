import React, { Component, ErrorInfo, ReactNode, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme } from './ThemeContext';
import type { ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';
import { logBoundaryError, getUserFriendlyErrorMessage, isRecoverableError } from '@/utils/errorLogger';
import { useUserStore } from '@/store/userStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorContentProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
}

function ErrorContent({ error, errorInfo, onRetry }: ErrorContentProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const userName = useUserStore(state => state.userName);
  const userId = useUserStore(state => state.userId);
  const styles = getStyles(colors);

  // Log error for debugging
  if (error && errorInfo) {
    logBoundaryError(error, errorInfo, userId);
  }

  // Get user-friendly error message
  const friendlyMessage = error ? getUserFriendlyErrorMessage(error) :
    'We encountered an unexpected error. Do not worry, it is not your fault!';

  const handleGoHome = () => {
    // Navigate to home screen
    router.replace('/home');
  };

  const handleRetry = () => {
    // Try to recover from error
    onRetry();
  };

  const isRecoverable = error ? isRecoverableError(error) : true;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Feather name="alert-circle" size={48} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>Oops! Something went wrong</Text>

      <Text style={styles.message}>
        {friendlyMessage}
      </Text>

      {error && process.env.NODE_ENV === 'development' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Details:</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>What you can do:</Text>
        <View style={styles.tipItem}>
          <Feather name="refresh-cw" size={16} color={colors.primary} />
          <Text style={styles.tipText}>Tap "Try Again" to recover</Text>
        </View>
        <View style={styles.tipItem}>
          <Feather name="home" size={16} color={colors.primary} />
          <Text style={styles.tipText}>Go to Home screen</Text>
        </View>
        <View style={styles.tipItem}>
          <Feather name="smartphone" size={16} color={colors.primary} />
          <Text style={styles.tipText}>Restart the app</Text>
        </View>
      </View>

      {/* Primary action - Try Again if recoverable */}
      {isRecoverable && (
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
          <Feather name="refresh-cw" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}

      {/* Secondary action - Go to Home */}
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.8}>
        <Feather name="home" size={20} color={colors.primary} />
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        If this problem persists, please contact learnsmartofficial24@gmail.com
      </Text>
    </ScrollView>
  );
}

class ErrorBoundaryWrapper extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorContent error={this.state.error} errorInfo={this.state.errorInfo} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
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
    },
    title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: colors.text, textAlign: 'center', marginBottom: Spacing.md },
    message: { fontSize: FontSizes.md, color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: FontSizes.md * 1.5 },
    errorContainer: {
      width: '100%',
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: colors.error, marginBottom: Spacing.xs },
    errorText: { fontSize: FontSizes.sm, color: colors.textSecondary },
    tipsContainer: { width: '100%', backgroundColor: colors.cardBackground, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.xl },
    tipsTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: colors.text, marginBottom: Spacing.md },
    tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    tipText: { fontSize: FontSizes.sm, color: colors.textSecondary, marginLeft: Spacing.sm, flex: 1 },
    retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, marginBottom: Spacing.md, minWidth: 160, minHeight: 56 },
    retryButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: '#FFFFFF', marginLeft: Spacing.sm },
    homeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardBackground, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, minWidth: 160, minHeight: 56, borderWidth: 2, borderColor: colors.primary },
    homeButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: colors.primary, marginLeft: Spacing.sm },
    footerText: { fontSize: FontSizes.xs, color: colors.textSecondary, textAlign: 'center', opacity: 0.7 },
  });

export default ErrorBoundaryWrapper;
