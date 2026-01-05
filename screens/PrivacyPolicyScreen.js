"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrivacyPolicyScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
function PrivacyPolicyScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent}>
        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>1. Data Collection</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart collects basic information to provide a personalized learning experience. This includes:
          {'\n'}• Your Name and Grade/Class selection
          {'\n'}• Learning progress (XP, streaks, completed lessons and quizzes)
          {'\n'}• Basic device information for analytics and app performance
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>2. Data Usage</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          Your data is used solely for personalizing your learning journey within LearnSmart. We do NOT sell or share your personal data with third-party advertisers or data brokers.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>3. AdMob Disclaimer</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          We use Google AdMob to display advertisements. Google may use device identifiers and cookies to serve ads based on your interests. Please refer to Google's Privacy Policy for more details.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>4. Amazon Affiliate Disclaimer</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart participates in the Amazon Services LLC Associates Program. When you click on book links, cookies may be used to track purchases for commission purposes. This does not increase the price you pay.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>5. Children's Privacy (COPPA)</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          LearnSmart is designed for students. We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without parental consent where required.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>6. User Rights</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          You have the right to:
          {'\n'}• Access your personal data
          {'\n'}• Request correction of inaccurate data
          {'\n'}• Request deletion of your data
          {'\n'}• Opt-out of personalized advertising
          {'\n'}• Object to data processing
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>7. Data Security</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          All user data is stored locally on your device. We do not use cloud storage for personal information. Your data is encrypted on your device and is only accessible by you. When you log out or uninstall the app, all your data is permanently deleted from your device.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>8. Data Retention</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          Your data is retained on your device until you:
          {'\n'}• Log out of your account
          {'\n'}• Uninstall the app
          {'\n'}• Request data deletion
          {'\n'}{'\n'}All data is permanently deleted when you log out or uninstall the app.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>9. Changes to This Policy</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this screen and updating the effective date. We encourage you to review this policy periodically.
        </react_native_1.Text>

        <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>10. Contact Us</react_native_1.Text>
        <react_native_1.Text style={[styles.content, { color: colors.textSecondary }]}>
          If you have any questions, concerns, or requests regarding your privacy, please contact us:
          {'\n'}{'\n'}Email: learnsmartofficial24@gmail.com
          {'\n'}Response Time: Within 30 days
          {'\n'}{'\n'}For GDPR requests, COPPA inquiries, or any privacy-related questions, we are here to help.
        </react_native_1.Text>

        <react_native_1.View style={styles.footer}>
          <react_native_1.Text style={[styles.version, { color: colors.textSecondary }]}>Effective Date: January 1, 2025</react_native_1.Text>
          <react_native_1.Text style={[styles.version, { color: colors.textSecondary }]}>Last Updated: January 1, 2025</react_native_1.Text>
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
