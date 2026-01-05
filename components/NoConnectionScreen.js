"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoConnectionScreen;
exports.ConnectionRestoredScreen = ConnectionRestoredScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
function NoConnectionScreen(_a) {
    var onRetry = _a.onRetry, _b = _a.message, message = _b === void 0 ? 'Check your internet connection and try again' : _b;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.iconContainer}>
          <react_native_1.View style={styles.iconBackground}>
            <vector_icons_1.Feather name="wifi-off" size={48} color={colors.primary}/>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.Text style={styles.title}>No Connection</react_native_1.Text>
        <react_native_1.Text style={styles.message}>{message}</react_native_1.Text>

        <react_native_1.View style={styles.tipsContainer}>
          <react_native_1.Text style={styles.tipsTitle}>Quick tips:</react_native_1.Text>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="check-circle" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>Check if Wi-Fi or mobile data is on</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="check-circle" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>Move to an area with better signal</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="check-circle" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>Restart your device if needed</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <vector_icons_1.Feather name="refresh-cw" size={20} color="#FFFFFF"/>
          <react_native_1.Text style={styles.retryButtonText}>Try Again</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.Text style={styles.helpText}>
          Once you are back online, this screen will disappear automatically.
        </react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: theme_1.Spacing.xl },
        content: { width: '100%', maxWidth: 400, alignItems: 'center' },
        iconContainer: { marginBottom: theme_1.Spacing.xl },
        iconBackground: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.cardBackground,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.primary,
            borderStyle: 'dashed',
        },
        title: { fontSize: theme_1.FontSizes.xxl, fontWeight: theme_1.FontWeights.bold, color: colors.text, marginBottom: theme_1.Spacing.md, textAlign: 'center' },
        message: { fontSize: theme_1.FontSizes.md, color: colors.textSecondary, textAlign: 'center', marginBottom: theme_1.Spacing.xl, lineHeight: theme_1.FontSizes.md * 1.5 },
        tipsContainer: { width: '100%', backgroundColor: colors.cardBackground, borderRadius: theme_1.BorderRadius.lg, padding: theme_1.Spacing.lg, marginBottom: theme_1.Spacing.xl },
        tipsTitle: { fontSize: theme_1.FontSizes.sm, fontWeight: theme_1.FontWeights.semibold, color: colors.text, marginBottom: theme_1.Spacing.md },
        tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: theme_1.Spacing.sm },
        tipText: { fontSize: theme_1.FontSizes.sm, color: colors.textSecondary, marginLeft: theme_1.Spacing.sm, flex: 1 },
        retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: theme_1.Spacing.md, paddingHorizontal: theme_1.Spacing.xl, borderRadius: theme_1.BorderRadius.lg, marginBottom: theme_1.Spacing.lg, minWidth: 160, minHeight: 56 },
        retryButtonText: { fontSize: theme_1.FontSizes.md, fontWeight: theme_1.FontWeights.semibold, color: '#FFFFFF', marginLeft: theme_1.Spacing.sm },
        helpText: { fontSize: theme_1.FontSizes.xs, color: colors.textSecondary, textAlign: 'center', opacity: 0.7, lineHeight: theme_1.FontSizes.xs * 1.4 },
    });
};
// Connected State Screen (when connection is restored)
function ConnectionRestoredScreen(_a) {
    var onContinue = _a.onContinue;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.iconBackground}>
          <vector_icons_1.Feather name="wifi" size={48} color="#FFFFFF"/>
        </react_native_1.View>

        <react_native_1.Text style={styles.title}>You are Back Online!</react_native_1.Text>
        <react_native_1.Text style={styles.message}>Your connection has been restored.</react_native_1.Text>

        <react_native_1.TouchableOpacity style={styles.retryButton} onPress={onContinue} activeOpacity={0.8}>
          <vector_icons_1.Feather name="arrow-right" size={20} color="#FFFFFF"/>
          <react_native_1.Text style={styles.retryButtonText}>Continue</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
