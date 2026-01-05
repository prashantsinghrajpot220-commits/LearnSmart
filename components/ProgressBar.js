"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProgressBar;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var xpStore_1 = require("@/store/xpStore");
function ProgressBar(_a) {
    var _b = _a.showText, showText = _b === void 0 ? true : _b;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var _d = (0, xpStore_1.useCurrentRank)(), rank = _d.rank, progress = _d.progress, currentXP = _d.currentXP, xpToNext = _d.xpToNext;
    var animatedProgress = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    (0, react_1.useEffect)(function () {
        react_native_1.Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 800,
            useNativeDriver: false,
            easing: react_native_1.Easing.out(react_native_1.Easing.cubic),
        }).start();
    }, [progress, animatedProgress]);
    var barWidth = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });
    var styles = getStyles(colors, isDark);
    var isMaxRank = !Number.isFinite(xpToNext) || xpToNext <= 0;
    var maxXP = isMaxRank ? currentXP : rank.maxXP;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.rankBadge}>
          <react_native_1.Text style={styles.rankIcon}>{rank.icon}</react_native_1.Text>
          <react_native_1.Text style={styles.rankName}>{rank.name}</react_native_1.Text>
        </react_native_1.View>
        {showText && (<react_native_1.Text style={styles.xpText}>
            {currentXP} / {isMaxRank ? '∞' : maxXP} XP
          </react_native_1.Text>)}
      </react_native_1.View>
      
      <react_native_1.View style={styles.progressContainer}>
        <react_native_1.View style={styles.progressBackground}>
          <react_native_1.Animated.View style={[
            styles.progressFill,
            { width: barWidth },
        ]}/>
        </react_native_1.View>
      </react_native_1.View>
      
      {showText && !isMaxRank && (<react_native_1.Text style={styles.helperText}>
          {xpToNext} XP to {rank.name === 'Novice' ? 'Seeker' : rank.name === 'Seeker' ? 'Scholar' : 'Sage'}
        </react_native_1.Text>)}
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: theme_1.Spacing.lg,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        rankBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.xl,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        rankIcon: {
            fontSize: 20,
            marginRight: theme_1.Spacing.xs,
        },
        rankName: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: isDark ? colors.text : colors.charcoal,
        },
        xpText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.textSecondary,
        },
        progressContainer: {
            width: '100%',
        },
        progressBackground: {
            height: 12,
            backgroundColor: colors.border,
            borderRadius: 6,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },
        progressFill: {
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 6,
            minWidth: 4,
        },
        helperText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: theme_1.Spacing.xs,
            textAlign: 'right',
        },
    });
};
