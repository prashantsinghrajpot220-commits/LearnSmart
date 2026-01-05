"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TermsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
function TermsScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent}>
        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          By downloading and using LearnSmart, you agree to abide by these Terms of Service and all applicable laws and regulations.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>2. App Usage Rights</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          We grant you a personal, non-exclusive, non-transferable license to use the app for personal, non-commercial educational purposes.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>3. Content Rights & Attribution</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart uses educational data and content derived from NCERT materials. We acknowledge NCERT as the source of this curriculum data. Users may not redistribute this content for commercial gain.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>4. User Responsibilities</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>5. Disclaimer of Liability</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is provided "as is" without warranties of any kind. We are not liable for any inaccuracies in educational content or for any disruptions in service.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>6. Modifications</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
        </react_native_1.Text>

        <react_native_1.View style={styles.footer}>
          <react_native_1.Text style={[styles.version, { color: colors.textSecondary }]}>Last Updated: December 2024</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.lg,
        paddingTop: theme_1.Spacing.xl,
    },
    backButton: {
        marginRight: theme_1.Spacing.md,
    },
    headerTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
    },
    scrollContent: {
        padding: theme_1.Spacing.lg,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        marginTop: theme_1.Spacing.xl,
        marginBottom: theme_1.Spacing.md,
    },
    content: {
        fontSize: theme_1.FontSizes.md,
        lineHeight: 24,
    },
    footer: {
        marginTop: theme_1.Spacing.xxl,
        alignItems: 'center',
    },
    version: {
        fontSize: theme_1.FontSizes.sm,
        fontStyle: 'italic',
    },
});
