"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PathwaysTab;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var ContentValidator_1 = require("@/services/ContentValidator");
var vector_icons_1 = require("@expo/vector-icons");
var seniorData_1 = require("@/data/seniorData");
function PathwaysTab() {
    var _a;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var ageGroup = (_a = (0, userStore_1.useUserStore)(function (s) { return s.ageGroup; })) !== null && _a !== void 0 ? _a : 'under12';
    var pathways = (0, react_1.useMemo)(function () {
        return ContentValidator_1.ContentValidator.validatePathwaysSync(seniorData_1.SENIOR_PATHWAYS, {
            contentId: 'pathways:senior',
            ageGroup: ageGroup,
            source: 'PathwaysTab',
        });
    }, [ageGroup]);
    var handlePathwayPress = function (pathway) {
        // Navigate to chapters screen with pathway details
        router.push({
            pathname: '/chapters',
            params: {
                subject: pathway.category,
                class: 'Class 12+',
                pathwayId: pathway.id,
                isPathway: 'true',
            },
        });
    };
    var styles = getStyles(colors);
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <react_native_1.View style={styles.content}>
        {/* Competitive Exams Section */}
        <react_native_1.View style={styles.categorySection}>
          <react_native_1.View style={styles.categoryHeader}>
            <react_native_1.View style={styles.categoryIcon}>
              <vector_icons_1.Feather name="target" size={20} color={colors.white}/>
            </react_native_1.View>
            <react_native_1.Text style={styles.categoryTitle}>Competitive Exams</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.pathwaysGrid}>
            {pathways.filter(function (p) { return p.category === 'Competitive Exams'; }).map(function (pathway) { return (<react_native_1.TouchableOpacity key={pathway.id} style={styles.pathwayCard} onPress={function () { return handlePathwayPress(pathway); }} activeOpacity={0.8}>
                <react_native_1.View style={styles.cardHeader}>
                  <react_native_1.View style={styles.pathwayIcon}>
                    <vector_icons_1.Feather name={pathway.icon} size={24} color={colors.white}/>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.pathwayTitle}>{pathway.title}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.pathwayDescription} numberOfLines={2}>
                  {pathway.description}
                </react_native_1.Text>
                <react_native_1.View style={styles.cardFooter}>
                  <vector_icons_1.Feather name="chevron-right" size={16} color={colors.textSecondary}/>
                </react_native_1.View>
              </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>
        </react_native_1.View>

        {/* Skill Building Section */}
        <react_native_1.View style={styles.categorySection}>
          <react_native_1.View style={styles.categoryHeader}>
            <react_native_1.View style={styles.categoryIcon}>
              <vector_icons_1.Feather name="tool" size={20} color={colors.white}/>
            </react_native_1.View>
            <react_native_1.Text style={styles.categoryTitle}>Skill Building</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.pathwaysGrid}>
            {pathways.filter(function (p) { return p.category === 'Skill Building'; }).map(function (pathway) { return (<react_native_1.TouchableOpacity key={pathway.id} style={styles.pathwayCard} onPress={function () { return handlePathwayPress(pathway); }} activeOpacity={0.8}>
                <react_native_1.View style={styles.cardHeader}>
                  <react_native_1.View style={styles.pathwayIcon}>
                    <vector_icons_1.Feather name={pathway.icon} size={24} color={colors.white}/>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.pathwayTitle}>{pathway.title}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.pathwayDescription} numberOfLines={2}>
                  {pathway.description}
                </react_native_1.Text>
                <react_native_1.View style={styles.cardFooter}>
                  <vector_icons_1.Feather name="chevron-right" size={16} color={colors.textSecondary}/>
                </react_native_1.View>
              </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.ScrollView>);
}
var getStyles = function (colors) {
    var _a, _b;
    var maturePrimary = (_a = colors.maturePrimary) !== null && _a !== void 0 ? _a : '#7A9970';
    var matureText = (_b = colors.matureText) !== null && _b !== void 0 ? _b : '#1A1A1A';
    return react_native_1.StyleSheet.create({
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
        categorySection: {
            marginBottom: theme_1.Spacing.xl,
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.lg,
        },
        categoryIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: maturePrimary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        categoryTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.semibold,
            color: matureText,
        },
        pathwaysGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -theme_1.Spacing.sm,
        },
        pathwayCard: {
            backgroundColor: colors.cardBackground,
            flexBasis: react_native_1.Platform.select({ web: '48%', default: '46%' }),
            margin: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            borderWidth: 1,
            borderColor: colors.lightGray,
            minHeight: 140,
            justifyContent: 'space-between',
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        cardHeader: {
            marginBottom: theme_1.Spacing.sm,
        },
        pathwayIcon: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: maturePrimary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        pathwayTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: matureText,
            lineHeight: 22,
        },
        pathwayDescription: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: 18,
            flex: 1,
            marginBottom: theme_1.Spacing.sm,
        },
        cardFooter: {
            alignItems: 'flex-end',
        },
    });
};
