"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SocialNotificationBanner;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
function iconForType(type) {
    switch (type) {
        case 'group_invite':
            return { name: 'user-plus', label: 'Invite' };
        case 'group_message':
            return { name: 'message-circle', label: 'Message' };
        case 'group_quiz_created':
            return { name: 'clipboard', label: 'Quiz' };
        case 'group_quiz_result':
            return { name: 'award', label: 'Results' };
        default:
            return { name: 'bell', label: 'Notification' };
    }
}
function SocialNotificationBanner(_a) {
    var notification = _a.notification, onDismiss = _a.onDismiss;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var translateY = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(-120); }, []);
    var opacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var hide = (0, react_1.useCallback)(function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(translateY, { toValue: -120, duration: 220, useNativeDriver: true }),
            react_native_1.Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(function () {
            onDismiss();
        });
    }, [onDismiss, opacity, translateY]);
    (0, react_1.useEffect)(function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 40 }),
            react_native_1.Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]).start();
        var timer = setTimeout(function () {
            hide();
        }, 3500);
        return function () { return clearTimeout(timer); };
    }, [hide, notification.id, opacity, translateY]);
    var styles = getStyles(colors, isDark);
    var icon = iconForType(notification.type);
    return (<react_native_1.Animated.View style={[styles.container, { transform: [{ translateY: translateY }], opacity: opacity }]}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.iconContainer}>
          <vector_icons_1.Feather name={icon.name} size={18} color={colors.primary}/>
        </react_native_1.View>

        <react_native_1.View style={styles.textContainer}>
          <react_native_1.Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </react_native_1.Text>
          <react_native_1.Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={styles.closeButton} onPress={hide}>
          <vector_icons_1.Feather name="x" size={18} color={colors.textSecondary}/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.Animated.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            position: 'absolute',
            top: react_native_1.Platform.select({ ios: 54, default: 16 }),
            left: theme_1.Spacing.lg,
            right: theme_1.Spacing.lg,
            zIndex: 2000,
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            paddingHorizontal: theme_1.Spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 14,
            elevation: 6,
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 2,
        },
        message: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.sm * 1.35,
        },
        closeButton: {
            padding: theme_1.Spacing.xs,
            marginLeft: theme_1.Spacing.sm,
        },
    });
};
