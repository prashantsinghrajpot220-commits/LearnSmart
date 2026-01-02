import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { PomodoroSession } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';
import { focusTracker } from '@/services/FocusTracker';

interface SessionCardProps {
  session: PomodoroSession;
  colors: any;
}

export default function SessionCard({ session, colors }: SessionCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const getFocusScoreColor = (score: number): string => {
    if (score >= 90) return colors.success || '#4CAF50';
    if (score >= 70) return '#8BC34A';
    if (score >= 50) return colors.warning || '#FFC107';
    return colors.error || '#F44336';
  };

  const getFocusScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Great';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Fair';
    return 'Needs Focus';
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{formatDate(session.startTime)}</Text>
          <Text style={styles.time}>{formatTime(session.startTime)}</Text>
        </View>
        <View style={styles.headerRight}>
          {session.treeSurvived ? (
            <View style={styles.treeBadge}>
              <Feather name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.treeBadgeText}>Tree Grown</Text>
            </View>
          ) : (
            <View style={styles.treeBadgeDead}>
              <Feather name="x-circle" size={16} color="#F44336" />
              <Text style={styles.treeBadgeText}>Tree Died</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              Studied for {formatDuration(session.actualStudyTime)}
            </Text>
          </View>
          {session.subject && (
            <View style={styles.infoItem}>
              <Feather name="book" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText} numberOfLines={1}>
                {session.subject}
                {session.chapter && ` • ${session.chapter}`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Focus Score</Text>
          <View style={styles.scoreContainer}>
            <View
              style={[
                styles.scoreBadge,
                { backgroundColor: getFocusScoreColor(session.focusScore) },
              ]}
            >
              <Text style={styles.scoreValue}>{session.focusScore}%</Text>
            </View>
            <Text style={[styles.scoreText, { color: getFocusScoreColor(session.focusScore) }]}>
              {getFocusScoreLabel(session.focusScore)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {},
    date: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    time: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
    treeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: '#E8F5E9',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    treeBadgeDead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: '#FFEBEE',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    treeBadgeText: {
      fontSize: FontSizes.xs,
      fontWeight: FontWeights.semibold,
      color: colors.textSecondary,
    },
    content: {
      gap: Spacing.md,
    },
    infoRow: {
      gap: Spacing.sm,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    infoText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      flex: 1,
    },
    scoreRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    scoreLabel: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    scoreBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    scoreValue: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.bold,
      color: colors.white,
    },
    scoreText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
    },
  });
