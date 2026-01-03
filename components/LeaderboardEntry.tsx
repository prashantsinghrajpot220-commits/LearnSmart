import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme } from './ThemeContext';
import { ReputationLeaderboardEntry } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardEntryProps {
  entry: ReputationLeaderboardEntry;
  isCurrentUser: boolean;
}

export default function LeaderboardEntry({ entry, isCurrentUser }: LeaderboardEntryProps) {
  const { colors } = useTheme();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Text style={styles.trophy}>🥇</Text>;
      case 2: return <Text style={styles.trophy}>🥈</Text>;
      case 3: return <Text style={styles.trophy}>🥉</Text>;
      default: return <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>#{rank}</Text>;
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isCurrentUser ? colors.primary + '10' : colors.cardBackground,
          borderColor: isCurrentUser ? colors.primary : colors.border 
        }
      ]}
    >
      <View style={styles.rankContainer}>
        {getRankIcon(entry.rank)}
      </View>

      <View style={styles.avatarContainer}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
          <Text style={{ fontSize: 20 }}>👤</Text>
        </View>
        {isCurrentUser && (
            <View style={[styles.currentUserBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="person" size={10} color="white" />
            </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
          {entry.userName}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="medal-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>{entry.badgeCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>{entry.helpfulAnswers}</Text>
          </View>
        </View>
      </View>

      <View style={styles.reputationContainer}>
        <Text style={[styles.reputationValue, { color: colors.primary }]}>{entry.reputation}</Text>
        <Text style={[styles.reputationLabel, { color: colors.textSecondary }]}>pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophy: {
    fontSize: 20,
  },
  rankNumber: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentUserBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  userName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  statText: {
    fontSize: FontSizes.xs,
    marginLeft: 2,
  },
  reputationContainer: {
    alignItems: 'flex-end',
  },
  reputationValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  reputationLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
