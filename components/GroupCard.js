"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var avatarStore_1 = require("@/data/avatarStore");
var GroupCard = (0, react_1.memo)(function (_a) {
    var _b;
    var group = _a.group, onPress = _a.onPress;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var memberAvatars = (0, react_1.useMemo)(function () {
        return Object.values(group.memberProfiles)
            .map(function (p) { return p.avatar; })
            .slice(0, 4)
            .map(function (avatarId) { var _a, _b; return (_b = (_a = (0, avatarStore_1.getAvatarById)(avatarId)) === null || _a === void 0 ? void 0 : _a.emoji) !== null && _b !== void 0 ? _b : '👤'; });
    }, [group.memberProfiles]);
    var styles = getStyles(colors, isDark);
    return (<react_native_1.TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.iconWrap}>
          {((_b = group.icon) === null || _b === void 0 ? void 0 : _b.startsWith('http')) ? (<react_native_1.Image source={{ uri: group.icon }} style={styles.iconImage}/>) : (<react_native_1.Text style={styles.iconText}>{group.icon || '👥'}</react_native_1.Text>)}
        </react_native_1.View>

        <react_native_1.View style={styles.meta}>
          <react_native_1.Text style={styles.name} numberOfLines={1}>
            {group.name}
          </react_native_1.Text>
          <react_native_1.Text style={styles.description} numberOfLines={2}>
            {group.description}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.footer}>
        <react_native_1.View style={styles.avatarRow}>
          {memberAvatars.map(function (emoji, idx) { return (<react_native_1.View key={"".concat(emoji, "-").concat(idx)} style={styles.avatarBubble}>
              <react_native_1.Text style={styles.avatarEmoji}>{emoji}</react_native_1.Text>
            </react_native_1.View>); })}
        </react_native_1.View>

        <react_native_1.Text style={styles.memberCount}>{group.members.length} members</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
});
exports.default = GroupCard;
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
        },
        iconWrap: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
            overflow: 'hidden',
        },
        iconText: {
            fontSize: 26,
        },
        iconImage: {
            width: '100%',
            height: '100%',
        },
        meta: {
            flex: 1,
        },
        name: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 2,
        },
        description: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.sm * 1.35,
        },
        footer: {
            marginTop: theme_1.Spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        avatarRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatarBubble: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 6,
        },
        avatarEmoji: {
            fontSize: 14,
        },
        memberCount: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            fontWeight: theme_1.FontWeights.medium,
        },
    });
};
