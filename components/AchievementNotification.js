"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AchievementNotification;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
function AchievementNotification(_a) {
    var achievementName = _a.achievementName, achievementIcon = _a.achievementIcon, visible = _a.visible, onHide = _a.onHide;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var translateY = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(-100); }, []);
    var opacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var scale = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0.8); }, []);
    var hideNotification = (0, react_1.useCallback)(function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(function () {
            onHide();
        });
    }, [opacity, onHide, translateY]);
    (0, react_1.useEffect)(function () {
        if (visible) {
            react_native_1.Animated.parallel([
                react_native_1.Animated.spring(translateY, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.spring(scale, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
            var timer_1 = setTimeout(function () {
                hideNotification();
            }, 3000);
            return function () { return clearTimeout(timer_1); };
        }
    }, [hideNotification, opacity, scale, translateY, visible]);
    var styles = getStyles(colors, isDark);
    if (!visible)
        return null;
    return (<react_native_1.Animated.View style={[
            styles.container,
            {
                transform: [{ translateY: translateY }, { scale: scale }],
                opacity: opacity,
            },
        ]}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.iconContainer}>
          <react_native_1.Text style={styles.icon}>{achievementIcon}</react_native_1.Text>
        </react_native_1.View>
        
        <react_native_1.View style={styles.textContainer}>
          <react_native_1.View style={styles.header}>
            <vector_icons_1.Feather name="award" size={14} color={colors.primary}/>
            <react_native_1.Text style={styles.label}>Achievement Unlocked!</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.Text style={styles.achievementName}>{achievementName}</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
          <vector_icons_1.Feather name="x" size={20} color={colors.textSecondary}/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.Animated.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            position: 'absolute',
            top: react_native_1.Platform.select({ web: 20, default: 60 }),
            left: theme_1.Spacing.lg,
            right: theme_1.Spacing.lg,
            zIndex: 1000,
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: colors.primary,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        icon: {
            fontSize: 28,
        },
        textContainer: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 2,
        },
        label: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.primary,
            fontWeight: theme_1.FontWeights.semibold,
            marginLeft: theme_1.Spacing.xs,
        },
        achievementName: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        closeButton: {
            padding: theme_1.Spacing.xs,
        },
    });
};
