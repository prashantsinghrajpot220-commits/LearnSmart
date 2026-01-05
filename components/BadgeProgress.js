"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BadgeProgress;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
function BadgeProgress(_a) {
    var progress = _a.progress;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var percent = Math.min(100, (progress.currentValue / progress.targetValue) * 100);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={[styles.name, { color: colors.text }]}>{progress.name}</react_native_1.Text>
        <react_native_1.Text style={[styles.values, { color: colors.textSecondary }]}>
          {progress.currentValue} / {progress.targetValue}
        </react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
        <react_native_1.View style={[
            styles.progressBarFill,
            {
                width: "".concat(percent, "%"),
                backgroundColor: colors.primary,
            },
        ]}/>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        marginBottom: theme_1.Spacing.md,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme_1.Spacing.xs,
    },
    name: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
    },
    values: {
        fontSize: theme_1.FontSizes.xs,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
