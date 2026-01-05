"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
function AboutScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={[styles.headerTitle, { color: colors.text }]}>About LearnSmart</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent}>
        <react_native_1.View style={styles.appInfo}>
          <react_native_1.View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
            <react_native_1.Text style={styles.logoText}>LS</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.Text style={[styles.appName, { color: colors.text }]}>LearnSmart</react_native_1.Text>
          <react_native_1.Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.Text style={[styles.missionTitle, { color: colors.text }]}>Our Mission</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is dedicated to making quality education accessible and engaging for students across India. By leveraging technology and NCERT-aligned curriculum, we provide a personalized learning path for every student.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.missionTitle, { color: colors.text }]}>Acknowledgments</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          • NCERT for educational materials and curriculum guidelines.
          {'\n'}• Vector artists and designers for aesthetic icons and avatars.
          {'\n'}• Open source community for React Native and Expo frameworks.
        </react_native_1.Text>

        <react_native_1.View style={styles.credits}>
          <react_native_1.Text style={[styles.creditsText, { color: colors.textSecondary }]}>
            Made with ❤️ for students everywhere.
          </react_native_1.Text>
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
    appInfo: {
        alignItems: 'center',
        marginVertical: theme_1.Spacing.xxl,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '800',
    },
    appName: {
        fontSize: theme_1.FontSizes.xxl,
        fontWeight: theme_1.FontWeights.bold,
    },
    version: {
        fontSize: theme_1.FontSizes.md,
        marginTop: theme_1.Spacing.xs,
    },
    missionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        marginTop: theme_1.Spacing.xl,
        marginBottom: theme_1.Spacing.md,
    },
    content: {
        fontSize: theme_1.FontSizes.md,
        lineHeight: 24,
    },
    credits: {
        marginTop: theme_1.Spacing.xxxl,
        alignItems: 'center',
    },
    creditsText: {
        fontSize: theme_1.FontSizes.sm,
        fontStyle: 'italic',
    },
});
