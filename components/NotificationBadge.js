"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationBadge;
var react_1 = require("react");
var react_native_1 = require("react-native");
var notificationStore_1 = require("@/store/notificationStore");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
function NotificationBadge(_a) {
    var _b = _a.size, size = _b === void 0 ? 18 : _b, _c = _a.showCount, showCount = _c === void 0 ? true : _c;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var getUnreadCount = (0, notificationStore_1.useNotificationStore)().getUnreadCount;
    var _d = (0, react_1.useState)(0), unreadCount = _d[0], setUnreadCount = _d[1];
    (0, react_1.useEffect)(function () {
        // Update unread count
        var updateCount = function () {
            setUnreadCount(getUnreadCount());
        };
        updateCount();
        // Set up a listener to update when notifications change
        var interval = setInterval(updateCount, 2000);
        return function () { return clearInterval(interval); };
    }, [getUnreadCount]);
    if (unreadCount === 0) {
        return null;
    }
    var displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();
    return (<react_native_1.View style={[
            styles.badge,
            {
                backgroundColor: colors.error,
                width: showCount ? (displayCount.length > 1 ? size * 1.6 : size) : 8,
                height: showCount ? size : 8,
            },
            !showCount && styles.dotOnly,
        ]}>
      {showCount && (<react_native_1.Text style={[
                styles.badgeText,
                {
                    fontSize: displayCount.length > 1 ? theme_1.FontSizes.xs : theme_1.FontSizes.sm,
                    color: colors.white,
                },
            ]}>
          {displayCount}
        </react_native_1.Text>)}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 18,
        paddingHorizontal: 4,
        zIndex: 10,
    },
    dotOnly: {
        minWidth: 8,
        paddingHorizontal: 0,
    },
    badgeText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 14,
    },
});
