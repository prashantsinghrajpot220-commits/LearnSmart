"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StreakBadge;
exports.StreakFreeze = StreakFreeze;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
function StreakBadge(_a) {
    var streak = _a.streak, _b = _a.showDetails, showDetails = _b === void 0 ? true : _b, onStreakPress = _a.onStreakPress, _c = _a.animateOnChange, animateOnChange = _c === void 0 ? false : _c;
    var _d = (0, ThemeContext_1.useTheme)(), colors = _d.colors, isDark = _d.isDark;
    var scaleAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(1); }, []);
    (0, react_1.useEffect)(function () {
        if (animateOnChange && streak > 0) {
            react_native_1.Animated.sequence([
                react_native_1.Animated.timing(scaleAnim, {
                    toValue: 1.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [streak, animateOnChange, scaleAnim]);
    var styles = getStyles(colors, isDark);
    var isZeroStreak = streak === 0;
    return (<react_native_1.TouchableOpacity style={[
            styles.container,
            isZeroStreak && styles.containerDisabled,
        ]} onPress={onStreakPress} activeOpacity={0.7} disabled={!onStreakPress}>
      <react_native_1.Animated.View style={[
            styles.badgeContent,
            { transform: [{ scale: scaleAnim }] },
        ]}>
        <react_native_1.View style={[styles.iconContainer, isZeroStreak && styles.iconContainerDisabled]}>
          <vector_icons_1.Feather name="sun" size={24} color={isZeroStreak ? colors.textSecondary : '#FF8C42'}/>
        </react_native_1.View>
        
        <react_native_1.View style={styles.textContainer}>
          <react_native_1.View style={styles.streakRow}>
            <react_native_1.Text style={[styles.streakNumber, isZeroStreak && styles.textDisabled]}>
              {streak}
            </react_native_1.Text>
            <react_native_1.Text style={[styles.streakLabel, isZeroStreak && styles.textDisabled]}>
              {streak === 1 ? 'day' : 'days'}
            </react_native_1.Text>
          </react_native_1.View>
          
          {showDetails && !isZeroStreak && (<react_native_1.Text style={styles.streakMessage}>
              Keep it up! 🔥
            </react_native_1.Text>)}
          
          {isZeroStreak && (<react_native_1.Text style={[styles.streakMessage, styles.textDisabled]}>
              Start your streak!
            </react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.Animated.View>
    </react_native_1.TouchableOpacity>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.lightGray,
        },
        containerDisabled: {
            opacity: 0.8,
        },
        badgeContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? '#2A2A2A' : '#FFF5EB',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        iconContainerDisabled: {
            backgroundColor: colors.lightGray,
        },
        textContainer: {
            flex: 1,
        },
        streakRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
        },
        streakNumber: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: '#FF8C42',
            marginRight: theme_1.Spacing.xs,
        },
        streakLabel: {
            fontSize: theme_1.FontSizes.md,
            color: '#FF8C42',
            fontWeight: theme_1.FontWeights.medium,
        },
        streakMessage: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 2,
        },
        textDisabled: {
            color: colors.textSecondary,
        },
    });
};
// Freeze placeholder component
function StreakFreeze() {
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var styles = getFreezeStyles(colors, isDark);
    return (<react_native_1.View style={[styles.container, styles.freezeContainer]}>
      <react_native_1.View style={styles.freezeBadgeContent}>
        <react_native_1.View style={styles.freezeIconContainer}>
          <vector_icons_1.Feather name="cloud-snow" size={20} color={colors.textSecondary}/>
        </react_native_1.View>
        <react_native_1.View style={styles.freezeTextContainer}>
          <react_native_1.View style={styles.freezeRow}>
            <react_native_1.Text style={[styles.freezeTitle, styles.textDisabled]}>
              Streak Freeze
            </react_native_1.Text>
            <react_native_1.View style={styles.lockBadge}>
              <vector_icons_1.Feather name="lock" size={12} color={colors.textSecondary}/>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={[styles.freezeSubtitle, styles.textDisabled]}>
            Unlock with Premium
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.Text style={styles.freezeDescription}>
        Coming soon - protect your streak from breaks!
      </react_native_1.Text>
    </react_native_1.View>);
}
var getFreezeStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.lightGray,
        },
        freezeContainer: {
            marginTop: theme_1.Spacing.md,
            backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: colors.lightGray,
        },
        freezeBadgeContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        freezeIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.lightGray,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        freezeTextContainer: {
            flex: 1,
        },
        freezeRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        freezeTitle: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
        },
        lockBadge: {
            marginLeft: theme_1.Spacing.sm,
        },
        freezeSubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        freezeDescription: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: theme_1.Spacing.sm,
            fontStyle: 'italic',
        },
        textDisabled: {
            opacity: 0.6,
        },
    });
};
