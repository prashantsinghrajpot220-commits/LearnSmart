"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileUploadButton;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
function FileUploadButton(_a) {
    var onPress = _a.onPress, icon = _a.icon, label = _a.label;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.TouchableOpacity style={[styles.button, { backgroundColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
      <react_native_1.Text style={styles.icon}>{icon}</react_native_1.Text>
      <react_native_1.Text style={[styles.label, { color: colors.text }]}>{label}</react_native_1.Text>
    </react_native_1.TouchableOpacity>);
}
var styles = react_native_1.StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
        marginRight: theme_1.Spacing.sm,
        marginBottom: theme_1.Spacing.xs,
    },
    icon: {
        fontSize: 18,
        marginRight: theme_1.Spacing.xs,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
});
