"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPBar = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("./ThemeContext");
var XPBar = function (_a) {
    var currentXP = _a.currentXP, maxXP = _a.maxXP, level = _a.level;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var progress = Math.min(Math.max(currentXP / maxXP, 0), 1);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={[styles.levelText, { color: colors.text }]}>Level {level}</react_native_1.Text>
        <react_native_1.Text style={[styles.xpText, { color: colors.textSecondary }]}>
          {currentXP} / {maxXP} XP
        </react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <react_native_1.View style={[
            styles.progressFill,
            {
                width: "".concat(progress * 100, "%"),
                backgroundColor: colors.primary
            }
        ]}/>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.XPBar = XPBar;
var styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    levelText: {
        fontSize: 16,
        fontWeight: '700',
    },
    xpText: {
        fontSize: 12,
    },
    barContainer: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
});
exports.default = exports.XPBar;
