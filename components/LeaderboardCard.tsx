import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LeaderboardEntry } from '@/store/userStore';
import { useTheme } from '@/components/ThemeContext';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  rank: number;
  onPress?: () => void;
  style?: any;
}

const LeaderboardCard = memo(({ 
  entry, 
  isCurrentUser = false, 
  rank,
  onPress,
  style 
}: LeaderboardCardProps) => {
  const { colors } = useTheme();

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return colors.textSecondary;
    }
  };

  const styles = getStyles(colors, isCurrentUser, rank);

  const CardComponent = (
    <View style={[styles.container, style]}>
      {/* Rank */}
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, { color: getRankColor(rank) }]}>
          {rank <= 3 ? getRankEmoji(rank) : rank}
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>{entry.avatar}</Text>
        {isCurrentUser && (
          <View style={styles.currentUserBadge}>
            <Text style={styles.currentUserBadgeText}>YOU</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {entry.userName}
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: colors.textSecondary }]}>
            {entry.weeklyXP} XP
          </Text>
          <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
          <Text style={[styles.stat, { color: colors.textSecondary }]}>
            🔥 {entry.streak}
          </Text>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View 
            style={[
              styles.xpBarFill, 
              { 
                width: `${Math.min((entry.weeklyXP / 500) * 100, 100)}%`,
                backgroundColor: isCurrentUser ? '#B2AC88' : colors.primary 
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardComponent}
      </TouchableOpacity>
    );
  }

  return CardComponent;
});

export default LeaderboardCard;

const getStyles = (colors: any, isCurrentUser: boolean, rank: number) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isCurrentUser ? '#B2AC8820' : colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: isCurrentUser ? 2 : 0,
    borderColor: isCurrentUser ? '#B2AC88' : 'transparent',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { elevation: 3 },
    }),
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  avatarContainer: {
    position: 'relative',
    marginHorizontal: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  currentUserBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#B2AC88',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  currentUserBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: FontWeights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    fontSize: FontSizes.sm,
  },
  separator: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  xpContainer: {
    width: 60,
    alignItems: 'center',
  },
  xpBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});