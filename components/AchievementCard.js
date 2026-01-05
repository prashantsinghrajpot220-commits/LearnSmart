"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AchievementCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
function AchievementCard(_a) {
    var achievement = _a.achievement, onPress = _a.onPress, _b = _a.showUnlockDate, showUnlockDate = _b === void 0 ? true : _b, _c = _a.animateOnUnlock, animateOnUnlock = _c === void 0 ? false : _c;
    var _d = (0, ThemeContext_1.useTheme)(), colors = _d.colors, isDark = _d.isDark;
    var scaleAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(achievement.unlocked ? 1 : 0.8); }, [achievement.id]);
    var glowAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, [achievement.id]);
    (0, react_1.useEffect)(function () {
        if (achievement.unlocked && animateOnUnlock) {
            react_native_1.Animated.parallel([
                react_native_1.Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start();
            // Pulse glow effect
            var pulse_1 = react_native_1.Animated.loop(react_native_1.Animated.sequence([
                react_native_1.Animated.timing(glowAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]));
            pulse_1.start();
            return function () { return pulse_1.stop(); };
        }
    }, [achievement.unlocked, animateOnUnlock, scaleAnim, glowAnim]);
    var formatDate = function (dateString) {
        if (!dateString)
            return '';
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };
    var styles = getStyles(colors, isDark, achievement.unlocked);
    return (<react_native_1.TouchableOpacity style={[
            styles.container,
            achievement.unlocked && styles.containerUnlocked,
        ]} onPress={onPress} activeOpacity={0.8} disabled={!achievement.unlocked}>
      <react_native_1.Animated.View style={[
            styles.card,
            {
                transform: [{ scale: scaleAnim }],
                opacity: achievement.unlocked ? 1 : 0.5,
            },
        ]}>
        {achievement.unlocked && (<react_native_1.Animated.View style={[
                styles.glow,
                {
                    opacity: glowAnim,
                },
            ]}/>)}

        {!achievement.unlocked && (<react_native_1.View style={styles.lockOverlay}>
            <react_native_1.Text style={styles.lockIcon}>🔒</react_native_1.Text>
          </react_native_1.View>)}

        <react_native_1.View style={[
            styles.iconContainer,
            achievement.unlocked && {
                backgroundColor: colors.border,
            },
        ]}>
          <react_native_1.Text style={[styles.icon, !achievement.unlocked && styles.iconLocked]}>
            {achievement.icon}
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={[styles.name, !achievement.unlocked && styles.textLocked]}>
            {achievement.name}
          </react_native_1.Text>
          <react_native_1.Text style={[styles.description, !achievement.unlocked && styles.textLocked]}>
            {achievement.description}
          </react_native_1.Text>
          
          {showUnlockDate && achievement.unlocked && achievement.unlockedDate && (<react_native_1.Text style={styles.unlockedDate}>
              Unlocked {formatDate(achievement.unlockedDate)}
            </react_native_1.Text>)}
        </react_native_1.View>

        <react_native_1.View style={styles.categoryBadge}>
          <react_native_1.Text style={styles.categoryText}>
            {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.Animated.View>
    </react_native_1.TouchableOpacity>);
}
var getStyles = function (colors, isDark, isUnlocked) {
    return react_native_1.StyleSheet.create({
        container: {
            width: '100%',
        },
        containerUnlocked: {
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
        },
        card: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            position: 'relative',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isUnlocked ? colors.primary : colors.lightGray,
        },
        glow: {
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            backgroundColor: colors.primary,
            opacity: 0.1,
            borderRadius: 100,
        },
        lockOverlay: {
            position: 'absolute',
            top: theme_1.Spacing.sm,
            right: theme_1.Spacing.sm,
            zIndex: 10,
        },
        lockIcon: {
            fontSize: 16,
            opacity: 0.6,
        },
        iconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        icon: {
            fontSize: 32,
        },
        iconLocked: {
            opacity: 0.4,
        },
        content: {
            flex: 1,
        },
        name: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: 4,
        },
        description: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.sm * 1.4,
        },
        textLocked: {
            opacity: 0.5,
        },
        unlockedDate: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.primary,
            marginTop: theme_1.Spacing.xs,
            fontWeight: theme_1.FontWeights.medium,
        },
        categoryBadge: {
            position: 'absolute',
            top: theme_1.Spacing.sm,
            left: theme_1.Spacing.sm,
            backgroundColor: colors.lightGray,
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: 2,
            borderRadius: theme_1.BorderRadius.sm,
        },
        categoryText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            fontWeight: theme_1.FontWeights.medium,
        },
    });
};
