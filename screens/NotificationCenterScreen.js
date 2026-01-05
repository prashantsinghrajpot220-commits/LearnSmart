"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationCenterScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var notificationStore_1 = require("@/store/notificationStore");
var vector_icons_1 = require("@expo/vector-icons");
var NotificationItem_1 = require("../components/NotificationItem");
var theme_1 = require("@/constants/theme");
function NotificationCenterScreen() {
    var _this = this;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, notificationStore_1.useNotificationStore)(), notifications = _a.notifications, loadNotifications = _a.loadNotifications, markAllAsRead = _a.markAllAsRead, clearAll = _a.clearAll, removeNotification = _a.removeNotification, getUnreadCount = _a.getUnreadCount;
    var _b = (0, react_1.useState)(false), refreshing = _b[0], setRefreshing = _b[1];
    var _c = (0, react_1.useState)('all'), filterType = _c[0], setFilterType = _c[1];
    (0, react_1.useEffect)(function () {
        loadNotifications();
    }, []);
    var onRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRefreshing(true);
                    return [4 /*yield*/, loadNotifications()];
                case 1:
                    _a.sent();
                    setRefreshing(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClearAll = function () {
        react_native_1.Alert.alert('Clear All Notifications', 'Are you sure you want to delete all notifications?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear All',
                style: 'destructive',
                onPress: function () {
                    clearAll();
                },
            },
        ]);
    };
    var handleMarkAllRead = function () {
        markAllAsRead();
    };
    var handleDeleteNotification = function (notificationId) {
        removeNotification(notificationId);
    };
    var getFilteredNotifications = function () {
        if (filterType === 'unread') {
            return notifications.filter(function (n) { return !n.read; });
        }
        return notifications;
    };
    var filteredNotifications = getFilteredNotifications();
    var unreadCount = getUnreadCount();
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <react_native_1.Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</react_native_1.Text>
        <react_native_1.View style={styles.headerActions}>
          {unreadCount > 0 && (<react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleMarkAllRead}>
              <react_native_1.Text style={[styles.actionButtonText, { color: colors.primary }]}>Mark all read</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
          {notifications.length > 0 && (<react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
              <react_native_1.Text style={[styles.actionButtonText, { color: colors.error }]}>Clear all</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={[styles.filterBar, { backgroundColor: colors.cardBackground }]}>
        <react_native_1.TouchableOpacity style={[
            styles.filterButton,
            filterType === 'all' && { backgroundColor: colors.primary },
        ]} onPress={function () { return setFilterType('all'); }}>
          <react_native_1.Text style={[
            styles.filterButtonText,
            { color: filterType === 'all' ? colors.white : colors.text },
        ]}>
            All ({notifications.length})
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[
            styles.filterButton,
            filterType === 'unread' && { backgroundColor: colors.primary },
        ]} onPress={function () { return setFilterType('unread'); }}>
          <react_native_1.Text style={[
            styles.filterButtonText,
            { color: filterType === 'unread' ? colors.white : colors.text },
        ]}>
            Unread ({unreadCount})
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}>
        {filteredNotifications.length === 0 ? (<react_native_1.View style={styles.emptyState}>
            <vector_icons_1.MaterialCommunityIcons name="bell-outline" size={80} color={colors.textSecondary}/>
            <react_native_1.Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              {filterType === 'unread' ? 'No unread notifications' : 'No notifications'}
            </react_native_1.Text>
            <react_native_1.Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {filterType === 'unread'
                ? 'All your notifications have been read'
                : 'You\'re all caught up! Check back later for updates.'}
            </react_native_1.Text>
          </react_native_1.View>) : (filteredNotifications.map(function (notification) { return (<NotificationItem_1.default key={notification.id} notification={notification} onDelete={handleDeleteNotification}/>); }))}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
    },
    headerActions: {
        flexDirection: 'row',
        gap: theme_1.Spacing.sm,
    },
    actionButton: {
        paddingHorizontal: theme_1.Spacing.sm,
    },
    actionButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
    },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.sm,
        gap: theme_1.Spacing.sm,
    },
    filterButton: {
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.xs,
        borderRadius: theme_1.BorderRadius.full,
    },
    filterButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: theme_1.Spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxl * 2,
    },
    emptyStateTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginTop: theme_1.Spacing.lg,
    },
    emptyStateText: {
        fontSize: theme_1.FontSizes.md,
        marginTop: theme_1.Spacing.sm,
        textAlign: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
});
