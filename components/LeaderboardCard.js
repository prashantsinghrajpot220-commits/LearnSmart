"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var LeaderboardCard = (0, react_1.memo)(function (_a) {
    var entry = _a.entry, _b = _a.isCurrentUser, isCurrentUser = _b === void 0 ? false : _b, rank = _a.rank, onPress = _a.onPress, style = _a.style;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var getRankEmoji = function (rank) {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return "".concat(rank);
        }
    };
    var getRankColor = function (rank) {
        switch (rank) {
            case 1: return '#FFD700';
            case 2: return '#C0C0C0';
            case 3: return '#CD7F32';
            default: return colors.textSecondary;
        }
    };
    var styles = getStyles(colors, isCurrentUser, rank);
    var CardComponent = (<react_native_1.View style={[styles.container, style]}>
      {/* Rank */}
      <react_native_1.View style={styles.rankContainer}>
        <react_native_1.Text style={[styles.rankText, { color: getRankColor(rank) }]}>
          {rank <= 3 ? getRankEmoji(rank) : rank}
        </react_native_1.Text>
      </react_native_1.View>

      {/* Avatar */}
      <react_native_1.View style={styles.avatarContainer}>
        <react_native_1.Text style={styles.avatarEmoji}>{entry.avatar}</react_native_1.Text>
        {isCurrentUser && (<react_native_1.View style={styles.currentUserBadge}>
            <react_native_1.Text style={styles.currentUserBadgeText}>YOU</react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.View>

      {/* User Info */}
      <react_native_1.View style={styles.userInfo}>
        <react_native_1.Text style={[styles.userName, { color: colors.text }]}>
          {entry.userName}
        </react_native_1.Text>
        <react_native_1.View style={styles.statsRow}>
          <react_native_1.Text style={[styles.stat, { color: colors.textSecondary }]}>
            {entry.weeklyXP} XP
          </react_native_1.Text>
          <react_native_1.Text style={[styles.separator, { color: colors.textSecondary }]}>•</react_native_1.Text>
          <react_native_1.Text style={[styles.stat, { color: colors.textSecondary }]}>
            🔥 {entry.streak}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      {/* XP Bar */}
      <react_native_1.View style={styles.xpContainer}>
        <react_native_1.View style={styles.xpBar}>
          <react_native_1.View style={[
            styles.xpBarFill,
            {
                width: "".concat(Math.min((entry.weeklyXP / 500) * 100, 100), "%"),
                backgroundColor: isCurrentUser ? '#B2AC88' : colors.primary
            }
        ]}/>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
    if (onPress) {
        return (<react_native_1.TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardComponent}
      </react_native_1.TouchableOpacity>);
    }
    return CardComponent;
});
exports.default = LeaderboardCard;
var getStyles = function (colors, isCurrentUser, rank) { return react_native_1.StyleSheet.create({
    container: __assign({ flexDirection: 'row', alignItems: 'center', backgroundColor: isCurrentUser ? '#B2AC8820' : colors.cardBackground, borderRadius: theme_1.BorderRadius.lg, padding: theme_1.Spacing.md, marginBottom: theme_1.Spacing.sm, borderWidth: isCurrentUser ? 2 : 0, borderColor: isCurrentUser ? '#B2AC88' : 'transparent' }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
        },
        android: { elevation: 3 },
    })),
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankText: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
    },
    avatarContainer: {
        position: 'relative',
        marginHorizontal: theme_1.Spacing.md,
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
        fontWeight: theme_1.FontWeights.bold,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        fontSize: theme_1.FontSizes.sm,
    },
    separator: {
        marginHorizontal: theme_1.Spacing.sm,
        fontSize: theme_1.FontSizes.sm,
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
}); };
