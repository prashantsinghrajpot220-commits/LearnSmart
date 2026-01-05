"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupChatMessage;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var userStore_1 = require("@/store/userStore");
var avatarStore_1 = require("@/data/avatarStore");
function GroupChatMessage(_a) {
    var _b;
    var message = _a.message, group = _a.group;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var userId = (0, userStore_1.useUserStore)().userId;
    var isOwn = message.userId === userId;
    var profile = group.memberProfiles[message.userId];
    var avatarEmoji = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        var id = (_a = profile === null || profile === void 0 ? void 0 : profile.avatar) !== null && _a !== void 0 ? _a : 'Robot';
        return (_c = (_b = (0, avatarStore_1.getAvatarById)(id)) === null || _b === void 0 ? void 0 : _b.emoji) !== null && _c !== void 0 ? _c : '👤';
    }, [profile === null || profile === void 0 ? void 0 : profile.avatar]);
    var displayName = (_b = profile === null || profile === void 0 ? void 0 : profile.userName) !== null && _b !== void 0 ? _b : 'Member';
    var styles = getStyles(colors, isDark, isOwn);
    return (<react_native_1.View style={styles.row}>
      {!isOwn ? (<react_native_1.View style={styles.avatar}>
          <react_native_1.Text style={styles.avatarEmoji}>{avatarEmoji}</react_native_1.Text>
        </react_native_1.View>) : null}

      <react_native_1.View style={styles.bubble}>
        {!isOwn ? <react_native_1.Text style={styles.name}>{displayName}</react_native_1.Text> : null}
        <react_native_1.Text style={styles.message}>{message.message}</react_native_1.Text>
        <react_native_1.Text style={styles.time}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</react_native_1.Text>
      </react_native_1.View>

      {isOwn ? (<react_native_1.View style={styles.avatar}>
          <react_native_1.Text style={styles.avatarEmoji}>{avatarEmoji}</react_native_1.Text>
        </react_native_1.View>) : null}
    </react_native_1.View>);
}
var getStyles = function (colors, isDark, isOwn) {
    return react_native_1.StyleSheet.create({
        row: {
            flexDirection: 'row',
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            marginBottom: theme_1.Spacing.sm,
        },
        avatar: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 6,
        },
        avatarEmoji: {
            fontSize: 14,
        },
        bubble: {
            maxWidth: '78%',
            backgroundColor: isOwn ? colors.primary : colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.sm,
            paddingHorizontal: theme_1.Spacing.md,
            borderWidth: isOwn ? 0 : 1,
            borderColor: colors.border,
        },
        name: {
            fontSize: theme_1.FontSizes.xs,
            fontWeight: theme_1.FontWeights.bold,
            color: isOwn ? '#FFFFFF' : colors.text,
            marginBottom: 2,
        },
        message: {
            fontSize: theme_1.FontSizes.sm,
            color: isOwn ? '#FFFFFF' : colors.text,
            lineHeight: theme_1.FontSizes.sm * 1.35,
        },
        time: {
            marginTop: 4,
            fontSize: 10,
            color: isOwn ? 'rgba(255,255,255,0.75)' : colors.textSecondary,
            alignSelf: 'flex-end',
        },
    });
};
