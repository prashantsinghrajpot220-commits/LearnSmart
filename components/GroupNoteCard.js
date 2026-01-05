"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupNoteCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var avatarStore_1 = require("@/data/avatarStore");
function GroupNoteCard(_a) {
    var _b;
    var note = _a.note, group = _a.group;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var profile = group.memberProfiles[note.userId];
    var avatarEmoji = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        var id = (_a = profile === null || profile === void 0 ? void 0 : profile.avatar) !== null && _a !== void 0 ? _a : 'Robot';
        return (_c = (_b = (0, avatarStore_1.getAvatarById)(id)) === null || _b === void 0 ? void 0 : _b.emoji) !== null && _c !== void 0 ? _c : '👤';
    }, [profile === null || profile === void 0 ? void 0 : profile.avatar]);
    var displayName = (_b = profile === null || profile === void 0 ? void 0 : profile.userName) !== null && _b !== void 0 ? _b : 'Member';
    var styles = getStyles(colors, isDark);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.avatar}>
          <react_native_1.Text style={styles.avatarEmoji}>{avatarEmoji}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.meta}>
          <react_native_1.Text style={styles.name}>{displayName}</react_native_1.Text>
          <react_native_1.Text style={styles.time}>{new Date(note.createdAt).toLocaleString()}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.Text style={styles.content}>{note.content}</react_native_1.Text>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        avatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        avatarEmoji: {
            fontSize: 18,
        },
        meta: {
            flex: 1,
        },
        name: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        time: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 2,
        },
        content: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            lineHeight: theme_1.FontSizes.md * 1.4,
        },
    });
};
