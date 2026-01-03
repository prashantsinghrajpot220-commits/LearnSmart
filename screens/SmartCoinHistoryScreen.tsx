import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useUserStore, CoinTransaction } from '@/store/userStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export default function SmartCoinHistoryScreen() {
  const { colors } = useTheme();
  const { getCoinTransactions, gamificationData } = useUserStore();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTransactions(getCoinTransactions());
  }, [getCoinTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    setTransactions(getCoinTransactions());
    setTimeout(() => setRefreshing(false), 500);
  };

  const formatTransactionDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const groupTransactionsByDate = (txs: CoinTransaction[]) => {
    const groups: { [key: string]: CoinTransaction[] } = {};

    txs.forEach(tx => {
      const dateKey = formatTransactionDate(tx.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });

    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[1][0].timestamp);
      const dateB = new Date(b[1][0].timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const groupedTransactions = groupTransactionsByDate(transactions);
  const totalEarned = transactions
    .filter(tx => tx.type === 'earned')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = transactions
    .filter(tx => tx.type === 'spent')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Balance Header */}
      <View style={[styles.balanceHeader, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.balanceContent}>
          <MaterialCommunityIcons name="cash" size={40} color="#FFD700" />
          <View style={styles.balanceInfo}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
              Current Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>
              {gamificationData.smartCoins}
            </Text>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earned</Text>
            <Text style={[styles.statValueEarned, { color: colors.success }]}>
              +{totalEarned}
            </Text>
          </View>
          <View style={[styles.stat, { marginLeft: Spacing.md }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent</Text>
            <Text style={[styles.statValueSpent, { color: colors.error }]}>
              -{totalSpent}
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="cash"
              size={80}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No transactions yet
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Start earning SmartCoins by answering questions and helping others!
            </Text>
          </View>
        ) : (
          groupedTransactions.map(([date, txs]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.textSecondary }]}>
                {date}
              </Text>
              <View style={[styles.transactionsList, { backgroundColor: colors.cardBackground }]}>
                {txs.map(tx => (
                  <View
                    key={tx.id}
                    style={[
                      styles.transactionItem,
                      { borderBottomColor: colors.lightGray },
                    ]}
                  >
                    <View style={styles.transactionLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor:
                              tx.type === 'earned'
                                ? colors.success + '20'
                                : colors.error + '20',
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={tx.type === 'earned' ? 'arrow-up' : 'arrow-down'}
                          size={20}
                          color={tx.type === 'earned' ? colors.success : colors.error}
                        />
                      </View>
                      <View style={styles.transactionDetails}>
                        <Text style={[styles.reason, { color: colors.text }]}>
                          {tx.reason}
                        </Text>
                        <Text style={[styles.time, { color: colors.textSecondary }]}>
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            tx.type === 'earned'
                              ? colors.success
                              : colors.error,
                        },
                      ]}
                    >
                      {tx.type === 'earned' ? '+' : '-'}
                      {tx.amount}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  balanceInfo: {
    marginLeft: Spacing.md,
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  balanceAmount: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: FontSizes.xs,
  },
  statValueEarned: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  statValueSpent: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.lg,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  transactionsList: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  reason: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  time: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  amount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
});
