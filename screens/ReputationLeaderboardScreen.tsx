import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { reputationService } from '@/services/ReputationService';
import { useUserStore, ReputationLeaderboardEntry } from '@/store/userStore';
import LeaderboardEntry from '@/components/LeaderboardEntry';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type TimePeriod = 'all-time' | 'monthly' | 'weekly';

export default function ReputationLeaderboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { userId, updateReputationRank } = useUserStore();
  const [period, setPeriod] = useState<TimePeriod>('all-time');
  const [leaderboard, setLeaderboard] = useState<ReputationLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    await new Promise(resolve => setTimeout(resolve, 0));
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
        const data = reputationService.generateMockLeaderboard(period);
        setLeaderboard(data);
        
        // Update user's rank if it's all-time
        if (period === 'all-time') {
            const userEntry = data.find(e => e.userId === userId);
            if (userEntry) {
                updateReputationRank(userEntry.rank);
            }
        }
        setLoading(false);
    }, 500);
  }

  useEffect(() => {
    setTimeout(() => {
        loadLeaderboard();
    }, 0);
  }, [period]);

  const renderPeriodTab = (tabPeriod: TimePeriod, label: string) => {
    const isActive = period === tabPeriod;
    return (
      <TouchableOpacity
        style={[
          styles.tab,
          { backgroundColor: isActive ? colors.primary : 'transparent' }
        ]}
        onPress={() => setPeriod(tabPeriod)}
      >
        <Text style={[
          styles.tabText,
          { color: isActive ? 'white' : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Community Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: colors.border + '40' }]}>
        {renderPeriodTab('all-time', 'All Time')}
        {renderPeriodTab('monthly', 'Monthly')}
        {renderPeriodTab('weekly', 'Weekly')}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <LeaderboardEntry 
              entry={item} 
              isCurrentUser={item.userId === userId} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: colors.textSecondary }}>No data available</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});
