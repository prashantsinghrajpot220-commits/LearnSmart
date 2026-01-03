import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface EngagementSuggestionsProps {
  onDismiss: () => void;
}

export default function EngagementSuggestions({ onDismiss }: EngagementSuggestionsProps) {
  const { colors } = useTheme();
  const { userAnswers, answerStreakCount } = useUserStore();

  const getSuggestion = () => {
    // Check streak and suggest if it's low
    if (answerStreakCount === 0) {
      return {
        icon: 'fire-alert',
        title: 'Start Your Streak!',
        message: 'Answer a question today to start your daily streak and earn coins.',
        action: 'Go to Forum',
      };
    }

    // Check if user has few answers
    if (userAnswers.length < 3) {
      return {
        icon: 'lightbulb-on',
        title: 'Help Others Learn',
        message: 'Share your knowledge by answering questions from other students.',
        action: 'Browse Questions',
      };
    }

    // General encouragement
    return {
      icon: 'hand-heart',
      title: 'Keep Helping!',
      message: 'Your answers help others learn. Keep up the great work!',
      action: 'Continue',
    };
  };

  const suggestion = getSuggestion();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '20' }]}>
          <MaterialCommunityIcons name={suggestion.icon as any} size={32} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{suggestion.title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {suggestion.message}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.dismissButton, { borderColor: colors.lightGray }]}
          onPress={onDismiss}
        >
          <MaterialCommunityIcons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 4,
  },
  message: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
