"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeaderboardEntry;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
function LeaderboardEntry(_a) {
    var entry = _a.entry, isCurrentUser = _a.isCurrentUser;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var getRankIcon = function (rank) {
        switch (rank) {
            case 1: return <react_native_1.Text style={styles.trophy}>🥇</react_native_1.Text>;
            case 2: return <react_native_1.Text style={styles.trophy}>🥈</react_native_1.Text>;
            case 3: return <react_native_1.Text style={styles.trophy}>🥉</react_native_1.Text>;
            default: return <react_native_1.Text style={[styles.rankNumber, { color: colors.textSecondary }]}>#{rank}</react_native_1.Text>;
        }
    };
    return (<react_native_1.View style={[
            styles.container,
            {
                backgroundColor: isCurrentUser ? colors.primary + '10' : colors.cardBackground,
                borderColor: isCurrentUser ? colors.primary : colors.border
            }
        ]}>
      <react_native_1.View style={styles.rankContainer}>
        {getRankIcon(entry.rank)}
      </react_native_1.View>

      <react_native_1.View style={styles.avatarContainer}>
        <react_native_1.View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
          <react_native_1.Text style={{ fontSize: 20 }}>👤</react_native_1.Text>
        </react_native_1.View>
        {isCurrentUser && (<react_native_1.View style={[styles.currentUserBadge, { backgroundColor: colors.primary }]}>
                <vector_icons_1.Ionicons name="person" size={10} color="white"/>
            </react_native_1.View>)}
      </react_native_1.View>

      <react_native_1.View style={styles.userInfo}>
        <react_native_1.Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
          {entry.userName}
        </react_native_1.Text>
        <react_native_1.View style={styles.statsRow}>
          <react_native_1.View style={styles.statItem}>
            <vector_icons_1.Ionicons name="medal-outline" size={12} color={colors.textSecondary}/>
            <react_native_1.Text style={[styles.statText, { color: colors.textSecondary }]}>{entry.badgeCount}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.statItem}>
            <vector_icons_1.Ionicons name="checkmark-circle-outline" size={12} color={colors.textSecondary}/>
            <react_native_1.Text style={[styles.statText, { color: colors.textSecondary }]}>{entry.helpfulAnswers}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.reputationContainer}>
        <react_native_1.Text style={[styles.reputationValue, { color: colors.primary }]}>{entry.reputation}</react_native_1.Text>
        <react_native_1.Text style={[styles.reputationLabel, { color: colors.textSecondary }]}>pts</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        marginBottom: theme_1.Spacing.sm,
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
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme_1.Spacing.md,
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
        marginRight: theme_1.Spacing.sm,
    },
    userName: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme_1.Spacing.sm,
    },
    statText: {
        fontSize: theme_1.FontSizes.xs,
        marginLeft: 2,
    },
    reputationContainer: {
        alignItems: 'flex-end',
    },
    reputationValue: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
    },
    reputationLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
});
