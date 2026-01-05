"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SmartCoinHistoryScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var userStore_1 = require("@/store/userStore");
var vector_icons_1 = require("@expo/vector-icons");
var theme_1 = require("@/constants/theme");
function SmartCoinHistoryScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, userStore_1.useUserStore)(), getCoinTransactions = _a.getCoinTransactions, gamificationData = _a.gamificationData;
    var _b = (0, react_1.useState)([]), transactions = _b[0], setTransactions = _b[1];
    var _c = (0, react_1.useState)(false), refreshing = _c[0], setRefreshing = _c[1];
    (0, react_1.useEffect)(function () {
        setTransactions(getCoinTransactions());
    }, [getCoinTransactions]);
    var onRefresh = function () {
        setRefreshing(true);
        setTransactions(getCoinTransactions());
        setTimeout(function () { return setRefreshing(false); }, 500);
    };
    var formatTransactionDate = function (timestamp) {
        var date = new Date(timestamp);
        var now = new Date();
        var diffMs = now.getTime() - date.getTime();
        var diffDays = Math.floor(diffMs / 86400000);
        if (diffDays === 0)
            return 'Today';
        if (diffDays === 1)
            return 'Yesterday';
        if (diffDays < 7)
            return "".concat(diffDays, " days ago");
        return date.toLocaleDateString();
    };
    var groupTransactionsByDate = function (txs) {
        var groups = {};
        txs.forEach(function (tx) {
            var dateKey = formatTransactionDate(tx.timestamp);
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(tx);
        });
        return Object.entries(groups).sort(function (a, b) {
            var dateA = new Date(a[1][0].timestamp);
            var dateB = new Date(b[1][0].timestamp);
            return dateB.getTime() - dateA.getTime();
        });
    };
    var groupedTransactions = groupTransactionsByDate(transactions);
    var totalEarned = transactions
        .filter(function (tx) { return tx.type === 'earned'; })
        .reduce(function (sum, tx) { return sum + tx.amount; }, 0);
    var totalSpent = transactions
        .filter(function (tx) { return tx.type === 'spent'; })
        .reduce(function (sum, tx) { return sum + tx.amount; }, 0);
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Balance Header */}
      <react_native_1.View style={[styles.balanceHeader, { backgroundColor: colors.cardBackground }]}>
        <react_native_1.View style={styles.balanceContent}>
          <vector_icons_1.MaterialCommunityIcons name="cash" size={40} color="#FFD700"/>
          <react_native_1.View style={styles.balanceInfo}>
            <react_native_1.Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
              Current Balance
            </react_native_1.Text>
            <react_native_1.Text style={[styles.balanceAmount, { color: colors.text }]}>
              {gamificationData.smartCoins}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.View style={styles.stats}>
          <react_native_1.View style={styles.stat}>
            <react_native_1.Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earned</react_native_1.Text>
            <react_native_1.Text style={[styles.statValueEarned, { color: colors.success }]}>
              +{totalEarned}
            </react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={[styles.stat, { marginLeft: theme_1.Spacing.md }]}>
            <react_native_1.Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent</react_native_1.Text>
            <react_native_1.Text style={[styles.statValueSpent, { color: colors.error }]}>
              -{totalSpent}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      {/* Transactions List */}
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}>
        {transactions.length === 0 ? (<react_native_1.View style={styles.emptyState}>
            <vector_icons_1.MaterialCommunityIcons name="cash" size={80} color={colors.textSecondary}/>
            <react_native_1.Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No transactions yet
            </react_native_1.Text>
            <react_native_1.Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Start earning SmartCoins by answering questions and helping others!
            </react_native_1.Text>
          </react_native_1.View>) : (groupedTransactions.map(function (_a) {
            var date = _a[0], txs = _a[1];
            return (<react_native_1.View key={date} style={styles.dateGroup}>
              <react_native_1.Text style={[styles.dateHeader, { color: colors.textSecondary }]}>
                {date}
              </react_native_1.Text>
              <react_native_1.View style={[styles.transactionsList, { backgroundColor: colors.cardBackground }]}>
                {txs.map(function (tx) { return (<react_native_1.View key={tx.id} style={[
                        styles.transactionItem,
                        { borderBottomColor: colors.lightGray },
                    ]}>
                    <react_native_1.View style={styles.transactionLeft}>
                      <react_native_1.View style={[
                        styles.iconContainer,
                        {
                            backgroundColor: tx.type === 'earned'
                                ? colors.success + '20'
                                : colors.error + '20',
                        },
                    ]}>
                        <vector_icons_1.MaterialCommunityIcons name={tx.type === 'earned' ? 'arrow-up' : 'arrow-down'} size={20} color={tx.type === 'earned' ? colors.success : colors.error}/>
                      </react_native_1.View>
                      <react_native_1.View style={styles.transactionDetails}>
                        <react_native_1.Text style={[styles.reason, { color: colors.text }]}>
                          {tx.reason}
                        </react_native_1.Text>
                        <react_native_1.Text style={[styles.time, { color: colors.textSecondary }]}>
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                        </react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.Text style={[
                        styles.amount,
                        {
                            color: tx.type === 'earned'
                                ? colors.success
                                : colors.error,
                        },
                    ]}>
                      {tx.type === 'earned' ? '+' : '-'}
                      {tx.amount}
                    </react_native_1.Text>
                  </react_native_1.View>); })}
              </react_native_1.View>
            </react_native_1.View>);
        }))}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    balanceHeader: {
        padding: theme_1.Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    balanceContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.lg,
    },
    balanceInfo: {
        marginLeft: theme_1.Spacing.md,
    },
    balanceLabel: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
    },
    balanceAmount: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
    },
    stats: {
        flexDirection: 'row',
    },
    stat: {
        flex: 1,
    },
    statLabel: {
        fontSize: theme_1.FontSizes.xs,
    },
    statValueEarned: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
    },
    statValueSpent: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: theme_1.Spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxl * 2,
    },
    emptyStateTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginTop: theme_1.Spacing.lg,
    },
    emptyStateText: {
        fontSize: theme_1.FontSizes.md,
        marginTop: theme_1.Spacing.sm,
        textAlign: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
    dateGroup: {
        marginBottom: theme_1.Spacing.lg,
    },
    dateHeader: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.semibold,
        marginBottom: theme_1.Spacing.sm,
    },
    transactionsList: {
        borderRadius: theme_1.BorderRadius.lg,
        overflow: 'hidden',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme_1.Spacing.md,
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
        borderRadius: theme_1.BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    transactionDetails: {
        flex: 1,
    },
    reason: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.medium,
    },
    time: {
        fontSize: theme_1.FontSizes.xs,
        marginTop: 2,
    },
    amount: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
    },
});
