"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PathwaysView;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var curriculum_1 = require("@/constants/curriculum");
var ThemeContext_1 = require("./ThemeContext");
function PathwaysView() {
    var router = (0, expo_router_1.useRouter)();
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var className = (0, expo_router_1.useLocalSearchParams)().class;
    var categories = (0, curriculum_1.getPathwayCategories)();
    var handleCategoryPress = function (category) {
        router.push({
            pathname: '/chapters',
            params: { subject: category.name, class: className, isPathway: 'true' },
        });
    };
    var styles = getStyles(colors, isDark);
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Choose Your Path</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>
            Select a category to explore courses and pathways
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.categoriesContainer}>
          {categories.map(function (category) { return (<react_native_1.TouchableOpacity key={category.id} style={styles.categoryCard} onPress={function () { return handleCategoryPress(category); }} activeOpacity={0.7}>
              <react_native_1.View style={styles.categoryIcon}>
                <react_native_1.Text style={styles.categoryIconText}>{category.icon}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.categoryName}>{category.name}</react_native_1.Text>
              <react_native_1.Text style={styles.categoryArrow}>→</react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.View>

        <react_native_1.View style={styles.infoCard}>
          <react_native_1.Text style={styles.infoTitle}>💡 Tip</react_native_1.Text>
          <react_native_1.Text style={styles.infoText}>
            You can switch between pathways at any time. Your progress is saved automatically.
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.ScrollView>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: theme_1.Spacing.xl,
        paddingTop: react_native_1.Platform.select({ web: theme_1.Spacing.xxl, default: theme_1.Spacing.xxl + 20 }),
        paddingBottom: theme_1.Spacing.xxl,
    },
    header: {
        marginBottom: theme_1.Spacing.xl,
    },
    title: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.sm,
    },
    subtitle: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    categoriesContainer: {
        marginBottom: theme_1.Spacing.xl,
    },
    categoryCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    categoryIconText: {
        fontSize: 28,
    },
    categoryName: {
        flex: 1,
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
    },
    categoryArrow: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.primary,
        fontWeight: theme_1.FontWeights.semibold,
    },
    infoCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoTitle: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    infoText: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
}); };
