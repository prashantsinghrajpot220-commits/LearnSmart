"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RankDisplay;
exports.RankBadge = RankBadge;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var xpStore_1 = require("@/store/xpStore");
function RankDisplay(_a) {
    var _b = _a.showProgress, showProgress = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, _d = _a.showAnimation, showAnimation = _d === void 0 ? false : _d;
    var _e = (0, ThemeContext_1.useTheme)(), colors = _e.colors, isDark = _e.isDark;
    var _f = (0, xpStore_1.useCurrentRank)(), rank = _f.rank, progress = _f.progress, currentXP = _f.currentXP, xpToNext = _f.xpToNext;
    var scale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
    var iconSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;
    var textSize = size === 'small' ? theme_1.FontSizes.sm : size === 'large' ? theme_1.FontSizes.xl : theme_1.FontSizes.lg;
    var styles = getStyles(colors, isDark, size);
    var isMaxRank = !Number.isFinite(xpToNext) || xpToNext <= 0;
    var maxXP = isMaxRank ? currentXP : rank.maxXP;
    return (<react_native_1.View style={[styles.container, { transform: [{ scale: scale }] }]}>
      <react_native_1.View style={styles.badgeContainer}>
        <react_native_1.View style={[styles.iconContainer, { borderColor: rank.color }]}>
          <react_native_1.Text style={[styles.icon, { fontSize: iconSize }]}>{rank.icon}</react_native_1.Text>
        </react_native_1.View>
        
        <react_native_1.View style={styles.infoContainer}>
          <react_native_1.Text style={styles.rankLabel}>Current Rank</react_native_1.Text>
          <react_native_1.Text style={[styles.rankName, { color: rank.color }]}>{rank.name}</react_native_1.Text>
          
          {showProgress && (<react_native_1.View style={styles.progressInfo}>
              <react_native_1.View style={styles.progressBar}>
                <react_native_1.View style={[
                styles.progressFill,
                {
                    width: "".concat(Math.min(progress * 100, 100), "%"),
                    backgroundColor: rank.color,
                },
            ]}/>
              </react_native_1.View>
              <react_native_1.Text style={styles.progressText}>
                {currentXP} / {isMaxRank ? '∞' : maxXP} XP
              </react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>
      </react_native_1.View>

      {showAnimation && !isMaxRank && (<react_native_1.View style={styles.nextRankHint}>
          <react_native_1.Text style={styles.nextRankText}>
            ⬆️ {rank.name === 'Novice' ? 'Seeker' : rank.name === 'Seeker' ? 'Scholar' : 'Sage'} in {xpToNext} XP
          </react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
}
function RankBadge(_a) {
    var rank = _a.rank, _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showLabel, showLabel = _c === void 0 ? true : _c;
    var _d = (0, ThemeContext_1.useTheme)(), colors = _d.colors, isDark = _d.isDark;
    var styles = getStyles(colors, isDark, size);
    var scale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
    var iconSize = size === 'small' ? 20 : size === 'large' ? 40 : 28;
    return (<react_native_1.View style={[styles.badgeOnly, { transform: [{ scale: scale }] }]}>
      <react_native_1.View style={[styles.badgeIconContainer, { borderColor: rank.color }]}>
        <react_native_1.Text style={{ fontSize: iconSize }}>{rank.icon}</react_native_1.Text>
      </react_native_1.View>
      {showLabel && (<react_native_1.Text style={[styles.badgeLabel, { color: rank.color }]}>{rank.name}</react_native_1.Text>)}
    </react_native_1.View>);
}
var getStyles = function (colors, isDark, size) {
    var padding = size === 'small' ? theme_1.Spacing.sm : size === 'large' ? theme_1.Spacing.xl : theme_1.Spacing.lg;
    var borderRadius = size === 'small' ? theme_1.BorderRadius.md : theme_1.BorderRadius.lg;
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: padding,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        badgeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            borderWidth: 3,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        icon: {
        // Icon is rendered as text (emoji)
        },
        infoContainer: {
            flex: 1,
        },
        rankLabel: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        rankName: {
            fontSize: size === 'small' ? theme_1.FontSizes.lg : theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            marginBottom: theme_1.Spacing.xs,
        },
        progressInfo: {
            marginTop: theme_1.Spacing.xs,
        },
        progressBar: {
            height: 6,
            backgroundColor: colors.lightGray,
            borderRadius: 3,
            overflow: 'hidden',
            marginBottom: 4,
        },
        progressFill: {
            height: '100%',
            borderRadius: 3,
        },
        progressText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
        },
        nextRankHint: {
            marginTop: theme_1.Spacing.md,
            paddingTop: theme_1.Spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.lightGray,
            alignItems: 'center',
        },
        nextRankText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            fontWeight: theme_1.FontWeights.medium,
        },
        // Badge-only styles
        badgeOnly: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            padding: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.lg,
        },
        badgeIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.sm,
        },
        badgeLabel: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
        },
    });
};
