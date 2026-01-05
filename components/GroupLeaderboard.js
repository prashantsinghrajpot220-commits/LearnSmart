"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupLeaderboard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var avatarStore_1 = require("@/data/avatarStore");
function GroupLeaderboard(_a) {
    var group = _a.group, quiz = _a.quiz;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var entries = (0, react_1.useMemo)(function () {
        return Object.entries(quiz.results)
            .map(function (_a) {
            var _b, _c, _d, _e;
            var userId = _a[0], result = _a[1];
            var profile = group.memberProfiles[userId];
            var avatarEmoji = (_d = (_c = (0, avatarStore_1.getAvatarById)((_b = profile === null || profile === void 0 ? void 0 : profile.avatar) !== null && _b !== void 0 ? _b : 'Robot')) === null || _c === void 0 ? void 0 : _c.emoji) !== null && _d !== void 0 ? _d : '👤';
            return {
                userId: userId,
                userName: (_e = profile === null || profile === void 0 ? void 0 : profile.userName) !== null && _e !== void 0 ? _e : 'Member',
                avatarEmoji: avatarEmoji,
                score: result.score,
            };
        })
            .sort(function (a, b) { return b.score - a.score; });
    }, [group.memberProfiles, quiz.results]);
    var styles = getStyles(colors, isDark);
    if (entries.length === 0) {
        return (<react_native_1.View style={styles.empty}>
        <react_native_1.Text style={styles.emptyTitle}>No results yet</react_native_1.Text>
        <react_native_1.Text style={styles.emptySubtitle}>Be the first to take this quiz.</react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.View>
      {entries.map(function (entry, index) {
            var rank = index + 1;
            var isTop3 = rank <= 3;
            return (<react_native_1.View key={entry.userId} style={[
                    styles.row,
                    isTop3 ? styles.topRow : null,
                    rank === 1 ? styles.first : null,
                    rank === 2 ? styles.second : null,
                    rank === 3 ? styles.third : null,
                ]}>
            <react_native_1.View style={styles.rankBubble}>
              <react_native_1.Text style={styles.rankText}>{rank}</react_native_1.Text>
            </react_native_1.View>

            <react_native_1.View style={styles.avatar}>
              <react_native_1.Text style={styles.avatarEmoji}>{entry.avatarEmoji}</react_native_1.Text>
            </react_native_1.View>

            <react_native_1.View style={styles.meta}>
              <react_native_1.Text style={styles.name} numberOfLines={1}>
                {entry.userName}
              </react_native_1.Text>
            </react_native_1.View>

            <react_native_1.Text style={styles.score}>{entry.score}%</react_native_1.Text>
          </react_native_1.View>);
        })}
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: theme_1.Spacing.sm,
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
            marginRight: theme_1.Spacing.md,
        },
        rankText: {
            color: '#FFFFFF',
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.bold,
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
            marginRight: theme_1.Spacing.md,
        },
        avatarEmoji: {
            fontSize: 16,
        },
        meta: {
            flex: 1,
        },
        name: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            fontWeight: theme_1.FontWeights.semibold,
        },
        score: {
            fontSize: theme_1.FontSizes.md,
            color: colors.primary,
            fontWeight: theme_1.FontWeights.bold,
        },
        empty: {
            padding: theme_1.Spacing.lg,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },
        emptyTitle: {
            fontSize: theme_1.FontSizes.lg,
            color: colors.text,
            fontWeight: theme_1.FontWeights.bold,
            marginBottom: 4,
        },
        emptySubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
    });
};
