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
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
var getNotificationIcon = function (type) {
    switch (type) {
        case 'group_invite':
            return { icon: 'account-group-plus', color: '#6366f1', bg: '#e0e7ff' };
        case 'group_message':
            return { icon: 'message-text', color: '#8b5cf6', bg: '#ede9fe' };
        case 'group_quiz_created':
            return { icon: 'trophy', color: '#f59e0b', bg: '#fef3c7' };
        case 'group_quiz_result':
            return { icon: 'podium', color: '#ec4899', bg: '#fce7f3' };
        case 'qa_new_answer':
            return { icon: 'comment-text', color: '#3b82f6', bg: '#dbeafe' };
        case 'qa_upvote':
            return { icon: 'thumb-up', color: '#10b981', bg: '#d1fae5' };
        case 'qa_helpful_mark':
            return { icon: 'star-face', color: '#f59e0b', bg: '#fef3c7' };
        case 'qa_badge_unlock':
            return { icon: 'medal', color: '#fbbf24', bg: '#fef9c3' };
        case 'qa_leaderboard':
            return { icon: 'chart-line-variant', color: '#8b5cf6', bg: '#ede9fe' };
        case 'qa_milestone':
            return { icon: 'flag', color: '#ec4899', bg: '#fce7f3' };
        case 'achievement':
            return { icon: 'trophy-award', color: '#fbbf24', bg: '#fef9c3' };
        default:
            return { icon: 'bell', color: '#6b7280', bg: '#f3f4f6' };
    }
};
var formatNotificationTime = function (createdAt) {
    var now = new Date();
    var created = new Date(createdAt);
    var diffMs = now.getTime() - created.getTime();
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
        return 'Just now';
    if (diffMins < 60)
        return "".concat(diffMins, "m ago");
    if (diffHours < 24)
        return "".concat(diffHours, "h ago");
    if (diffDays < 7)
        return "".concat(diffDays, "d ago");
    return created.toLocaleDateString();
};
var NotificationItem = (0, react_1.memo)(function (_a) {
    var notification = _a.notification, onPress = _a.onPress, onDelete = _a.onDelete;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var iconData = (0, react_1.useMemo)(function () { return getNotificationIcon(notification.type); }, [notification.type]);
    var timeAgo = (0, react_1.useMemo)(function () { return formatNotificationTime(notification.createdAt); }, [notification.createdAt]);
    return (<react_native_1.TouchableOpacity style={[
            styles.container,
            {
                backgroundColor: notification.read ? colors.cardBackground : colors.cardBackground + 'dd',
                borderColor: notification.read ? 'transparent' : colors.primary,
            },
        ]} onPress={onPress} activeOpacity={0.7}>
      {!notification.read && <react_native_1.View style={[styles.unreadDot, { backgroundColor: colors.primary }]}/>}

      <react_native_1.View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
        <vector_icons_1.MaterialCommunityIcons name={iconData.icon} size={24} color={iconData.color}/>
      </react_native_1.View>

      <react_native_1.View style={styles.content}>
        <react_native_1.Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {notification.title}
        </react_native_1.Text>
        <react_native_1.Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </react_native_1.Text>
        <react_native_1.Text style={[styles.time, { color: colors.textSecondary }]}>
          {timeAgo}
        </react_native_1.Text>
      </react_native_1.View>

      {onDelete && (<react_native_1.TouchableOpacity style={styles.deleteButton} onPress={function () { return onDelete(notification.id); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <vector_icons_1.Feather name="x" size={18} color={colors.textSecondary}/>
        </react_native_1.TouchableOpacity>)}
    </react_native_1.TouchableOpacity>);
});
exports.default = NotificationItem;
var styles = react_native_1.StyleSheet.create({
    container: __assign({ flexDirection: 'row', alignItems: 'flex-start', padding: theme_1.Spacing.md, borderRadius: theme_1.BorderRadius.lg, marginBottom: theme_1.Spacing.sm, borderWidth: 1 }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        android: {
            elevation: 1,
        },
    })),
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        top: 12,
        left: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        marginBottom: 2,
    },
    message: {
        fontSize: theme_1.FontSizes.sm,
        lineHeight: 18,
        marginBottom: 4,
    },
    time: {
        fontSize: theme_1.FontSizes.xs,
        color: '#999999',
    },
    deleteButton: {
        padding: theme_1.Spacing.xs,
        marginLeft: theme_1.Spacing.sm,
    },
});
