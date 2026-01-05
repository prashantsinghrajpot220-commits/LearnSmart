"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BadgeDisplay;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
function BadgeDisplay(_a) {
    var badge = _a.badge, _b = _a.size, size = _b === void 0 ? 'md' : _b;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var iconSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 32;
    var containerSize = size === 'sm' ? 40 : size === 'lg' ? 80 : 56;
    var fontSize = size === 'sm' ? theme_1.FontSizes.xs : size === 'lg' ? theme_1.FontSizes.md : theme_1.FontSizes.sm;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[
            styles.iconContainer,
            {
                width: containerSize,
                height: containerSize,
                borderRadius: containerSize / 2,
                backgroundColor: colors.cardBackground,
                borderColor: colors.primary,
                borderWidth: 1,
            },
        ]}>
        <react_native_1.Text style={{ fontSize: iconSize }}>{badge.icon}</react_native_1.Text>
      </react_native_1.View>
      <react_native_1.Text style={[styles.name, { fontSize: fontSize, color: colors.text }]}>{badge.name}</react_native_1.Text>
      {size !== 'sm' && (<react_native_1.Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </react_native_1.Text>)}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: theme_1.Spacing.md,
        width: 80,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.Spacing.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontWeight: theme_1.FontWeights.semibold,
        textAlign: 'center',
        marginBottom: 2,
    },
    date: {
        fontSize: 10,
        textAlign: 'center',
    },
});
