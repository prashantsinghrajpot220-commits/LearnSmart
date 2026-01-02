import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/components/ThemeContext';
import type { StudyGroup } from '@/services/StudyGroupService';
import type { GroupQuiz } from '@/services/GroupQuizService';
import { getAvatarById } from '@/data/avatarStore';

interface GroupLeaderboardProps {
  group: StudyGroup;
  quiz: GroupQuiz;
}

export default function GroupLeaderboard({ group, quiz }: GroupLeaderboardProps) {
  const { colors, isDark } = useTheme();

  const entries = useMemo(() => {
    return Object.entries(quiz.results)
      .map(([userId, result]) => {
        const profile = group.memberProfiles[userId];
        const avatarEmoji = getAvatarById(profile?.avatar ?? 'Robot')?.emoji ?? '👤';
        return {
          userId,
          userName: profile?.userName ?? 'Member',
          avatarEmoji,
          score: result.score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [group.memberProfiles, quiz.results]);

  const styles = getStyles(colors, isDark);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No results yet</Text>
        <Text style={styles.emptySubtitle}>Be the first to take this quiz.</Text>
      </View>
    );
  }

  return (
    <View>
      {entries.map((entry, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        return (
          <View
            key={entry.userId}
            style={[
              styles.row,
              isTop3 ? styles.topRow : null,
              rank === 1 ? styles.first : null,
              rank === 2 ? styles.second : null,
              rank === 3 ? styles.third : null,
            ]}
          >
            <View style={styles.rankBubble}>
              <Text style={styles.rankText}>{rank}</Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{entry.avatarEmoji}</Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.name} numberOfLines={1}>
                {entry.userName}
              </Text>
            </View>

            <Text style={styles.score}>{entry.score}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.sm,
    },
    topRow: {
      borderColor: colors.primary,
    },
    first: {
      backgroundColor: isDark ? '#1E3D2A' : '#E8F5E9',
    },
    second: {
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
    },
    third: {
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
    },
    rankBubble: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    rankText: {
      color: '#FFFFFF',
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.bold,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    avatarEmoji: {
      fontSize: 16,
    },
    meta: {
      flex: 1,
    },
    name: {
      fontSize: FontSizes.md,
      color: colors.text,
      fontWeight: FontWeights.semibold,
    },
    score: {
      fontSize: FontSizes.md,
      color: colors.primary,
      fontWeight: FontWeights.bold,
    },
    empty: {
      padding: Spacing.lg,
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: FontSizes.lg,
      color: colors.text,
      fontWeight: FontWeights.bold,
      marginBottom: 4,
    },
    emptySubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
  });
