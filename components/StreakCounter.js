"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StreakCounter;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var theme_1 = require("@/constants/theme");
function StreakCounter(_a) {
    var _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showLabel, showLabel = _c === void 0 ? true : _c, externalStreakCount = _a.streakCount;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var answerStreakCount = (0, userStore_1.useUserStore)().answerStreakCount;
    var streakCount = externalStreakCount !== null && externalStreakCount !== void 0 ? externalStreakCount : answerStreakCount;
    var sizeStyles = {
        small: {
            icon: 20,
            text: theme_1.FontSizes.sm,
            padding: theme_1.Spacing.xs,
        },
        medium: {
            icon: 24,
            text: theme_1.FontSizes.md,
            padding: theme_1.Spacing.sm,
        },
        large: {
            icon: 32,
            text: theme_1.FontSizes.xl,
            padding: theme_1.Spacing.md,
        },
    };
    var currentSize = sizeStyles[size];
    var flameColor = streakCount > 0 ? '#FF6B35' : '#9CA3AF';
    return (<react_native_1.View style={[
            styles.container,
            {
                backgroundColor: streakCount > 0 ? colors.cardBackground : colors.cardBackground + '80',
                padding: currentSize.padding,
            },
        ]}>
      <vector_icons_1.MaterialCommunityIcons name="fire" size={currentSize.icon} color={flameColor}/>
      <react_native_1.Text style={[
            styles.count,
            {
                color: streakCount > 0 ? colors.text : colors.textSecondary,
                fontSize: currentSize.text,
            },
        ]}>
        {streakCount}
      </react_native_1.Text>
      {showLabel && (<react_native_1.Text style={[
                styles.label,
                {
                    color: colors.textSecondary,
                    fontSize: size === 'small' ? theme_1.FontSizes.xs : theme_1.FontSizes.sm,
                },
            ]}>
          {streakCount === 1 ? 'day' : 'days'}
        </react_native_1.Text>)}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme_1.BorderRadius.full,
        gap: 4,
    },
    count: {
        fontWeight: theme_1.FontWeights.bold,
    },
    label: {
        fontWeight: theme_1.FontWeights.medium,
    },
});
