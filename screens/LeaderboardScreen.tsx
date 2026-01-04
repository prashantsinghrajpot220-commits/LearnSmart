import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useUserStore } from '@/store/userStore';
import { leaderboardService, WeeklyLeaderboard } from '@/services/LeaderboardService';
import LeaderboardCard from '@/components/LeaderboardCard';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const { userId } = useUserStore();
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPreviousWeek, setShowPreviousWeek] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = showPreviousWeek 
        ? leaderboardService.getPreviousWeekLeaderboard()
        : await leaderboardService.getLeaderboard();
      
      setLeaderboard(data);
    } catch (error) {
                  // Debug statement removed
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  }, [showPreviousWeek]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  }, [loadLeaderboard]);

  React.useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleWeekToggle = () => {
    setShowPreviousWeek(!showPreviousWeek);
  };

  const getUserRank = () => {
    if (!leaderboard) return 0;
    return leaderboard.entries.find(entry => entry.userId === userId)?.rank || 0;
  };

  const getTopEntries = () => {
    if (!leaderboard) return [];
    return leaderboard.entries.slice(0, 10);
  };

  const getCurrentUserEntry = () => {
    if (!leaderboard) return null;
    return leaderboard.entries.find(entry => entry.userId === userId);
  };

  const styles = getStyles(colors);

  if (loading && !leaderboard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading leaderboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentUserEntry = getCurrentUserEntry();
  const userRank = getUserRank();
  const topEntries = getTopEntries();
  const timeUntilReset = leaderboardService.getTimeUntilNextReset();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {showPreviousWeek ? 'Last Week' : 'This Week'} Leaderboard
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Resets in {timeUntilReset}
          </Text>
        </View>

        {/* Week Toggle */}
        <View style={styles.weekToggleContainer}>
          <TouchableOpacity
            style={[
              styles.weekToggleButton,
              { 
                backgroundColor: !showPreviousWeek ? colors.primary : colors.cardBackground,
                borderColor: colors.primary 
              }
            ]}
            onPress={() => setShowPreviousWeek(false)}
          >
            <Text style={[
              styles.weekToggleText,
              { color: !showPreviousWeek ? 'white' : colors.text }
            ]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.weekToggleButton,
              { 
                backgroundColor: showPreviousWeek ? colors.primary : colors.cardBackground,
                borderColor: colors.primary 
              }
            ]}
            onPress={() => setShowPreviousWeek(true)}
          >
            <Text style={[
              styles.weekToggleText,
              { color: showPreviousWeek ? 'white' : colors.text }
            ]}>
              Last Week
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Stats Card */}
        {currentUserEntry && (
          <View style={[styles.userStatsCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.userStatsTitle, { color: colors.text }]}>
              Your Performance
            </Text>
            <View style={styles.userStatsRow}>
              <View style={styles.userStatItem}>
                <Text style={[styles.userStatValue, { color: '#B2AC88' }]}>
                  #{userRank}
                </Text>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Your Rank
                </Text>
              </View>
              <View style={styles.userStatItem}>
                <Text style={[styles.userStatValue, { color: colors.text }]}>
                  {currentUserEntry.weeklyXP}
                </Text>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Weekly XP
                </Text>
              </View>
              <View style={styles.userStatItem}>
                <Text style={[styles.userStatValue, { color: colors.text }]}>
                  🔥 {currentUserEntry.streak}
                </Text>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Streak
                </Text>
              </View>
            </View>
            
            {/* Progress to next rank */}
            {userRank > 0 && (
              <View style={styles.rankProgress}>
                <Text style={[styles.rankProgressText, { color: colors.textSecondary }]}>
                  {userRank <= 10 
                    ? '🎉 You\'re in the top 10!' 
                    : leaderboard ? `${leaderboardService.getXPToNextRank(leaderboard)} XP to next rank` : ''
                  }
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Top 10 Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🏆 Top 10 This Week
          </Text>
          
          {topEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="trophy-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No leaderboard data available
              </Text>
            </View>
          ) : (
            topEntries.map((entry) => (
              <LeaderboardCard
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === userId}
                rank={entry.rank}
              />
            ))
          )}
        </View>

        {/* Encouragement */}
        {userRank > 10 && (
          <View style={[styles.encouragementCard, { backgroundColor: colors.cardBackground }]}>
            <MaterialCommunityIcons name="trending-up" size={32} color={colors.primary} />
            <Text style={[styles.encouragementText, { color: colors.text }]}>
              Keep going! You're {userRank - 10} spots away from the top 10.
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.sm,
  },
  weekToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  weekToggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  weekToggleText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  userStatsCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  userStatsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStatItem: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  userStatLabel: {
    fontSize: FontSizes.sm,
  },
  rankProgress: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    alignItems: 'center',
  },
  rankProgressText: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
  leaderboardContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  encouragementCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
});