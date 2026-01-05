"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilePreview;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
function FilePreview(_a) {
    var name = _a.name, onRemove = _a.onRemove;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.border }]}>
      <react_native_1.Text style={styles.icon}>📄</react_native_1.Text>
      <react_native_1.Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {name}
      </react_native_1.Text>
      <react_native_1.TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <react_native_1.Text style={styles.removeButtonText}>✕</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.xs,
        borderRadius: theme_1.BorderRadius.md,
        marginRight: theme_1.Spacing.sm,
        maxWidth: 150,
    },
    icon: {
        fontSize: 16,
        marginRight: theme_1.Spacing.xs,
    },
    name: {
        fontSize: 12,
        flex: 1,
    },
    removeButton: {
        marginLeft: theme_1.Spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});
