"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrophyRoomScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var achievementStore_1 = require("@/store/achievementStore");
var AchievementCard_1 = require("@/components/AchievementCard");
var vector_icons_1 = require("@expo/vector-icons");
var CATEGORIES = [
    { key: 'all', label: 'All', icon: ' trophy' },
    { key: 'streak', label: 'Streaks', icon: 'zap' },
    { key: 'quiz', label: 'Quizzes', icon: 'clipboard' },
    { key: 'learning', label: 'Learning', icon: 'book-open' },
    { key: 'xp', label: 'XP', icon: 'star' },
];
function TrophyRoomScreen() {
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var router = (0, expo_router_1.useRouter)();
    var _b = (0, achievementStore_1.useAchievementStore)(), achievements = _b.achievements, getUnlockedCount = _b.getUnlockedCount;
    var _c = react_1.default.useState('all'), activeCategory = _c[0], setActiveCategory = _c[1];
    var filteredAchievements = react_1.default.useMemo(function () {
        if (activeCategory === 'all') {
            return achievements;
        }
        return achievements.filter(function (a) { return a.category === activeCategory; });
    }, [achievements, activeCategory]);
    var unlockedCount = getUnlockedCount();
    var totalCount = achievements.length;
    var progressPercent = Math.round((unlockedCount / totalCount) * 100);
    var styles = getStyles(colors, isDark);
    return (<react_native_1.View style={styles.container}>
      {/* Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity style={styles.backButton} onPress={function () { return router.back(); }} activeOpacity={0.7}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={styles.title}>Trophy Room</react_native_1.Text>
        <react_native_1.View style={styles.headerRight}/>
      </react_native_1.View>

      {/* Progress Summary */}
      <react_native_1.View style={styles.progressCard}>
        <react_native_1.View style={styles.progressHeader}>
          <react_native_1.View style={styles.trophyIcon}>
            <react_native_1.Text style={styles.trophyEmoji}>🏆</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.progressInfo}>
            <react_native_1.Text style={styles.progressTitle}>Your Collection</react_native_1.Text>
            <react_native_1.Text style={styles.progressSubtitle}>
              {unlockedCount} of {totalCount} unlocked
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.overallProgressBar}>
          <react_native_1.View style={styles.overallProgressBackground}>
            <react_native_1.View style={[styles.overallProgressFill, { width: "".concat(progressPercent, "%") }]}/>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.Text style={styles.progressPercent}>{progressPercent}% Complete</react_native_1.Text>
      </react_native_1.View>

      {/* Category Filter Tabs */}
      <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabs}>
        {CATEGORIES.map(function (cat) { return (<react_native_1.TouchableOpacity key={cat.key} style={[
                styles.categoryTab,
                activeCategory === cat.key && styles.categoryTabActive,
            ]} onPress={function () { return setActiveCategory(cat.key); }} activeOpacity={0.7}>
            <vector_icons_1.Feather name={cat.icon.trim()} size={16} color={activeCategory === cat.key ? '#FFFFFF' : colors.textSecondary}/>
            <react_native_1.Text style={[
                styles.categoryTabText,
                activeCategory === cat.key && styles.categoryTabTextActive,
            ]}>
              {cat.label}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>); })}
      </react_native_1.ScrollView>

      {/* Achievements Grid */}
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.achievementsGrid} showsVerticalScrollIndicator={false}>
        {filteredAchievements.map(function (achievement) { return (<react_native_1.View key={achievement.id} style={styles.achievementWrapper}>
            <AchievementCard_1.default achievement={achievement} showUnlockDate={true} animateOnUnlock={false}/>
          </react_native_1.View>); })}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.lg,
            paddingTop: react_native_1.Platform.select({ web: theme_1.Spacing.lg, default: theme_1.Spacing.lg + 20 }),
            paddingBottom: theme_1.Spacing.md,
            backgroundColor: colors.background,
        },
        backButton: {
            padding: theme_1.Spacing.sm,
            marginRight: theme_1.Spacing.sm,
        },
        title: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        headerRight: {
            width: 40,
        },
        progressCard: {
            backgroundColor: colors.cardBackground,
            marginHorizontal: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.lg,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        progressHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        trophyIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        trophyEmoji: {
            fontSize: 32,
        },
        progressInfo: {
            flex: 1,
        },
        progressTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
        },
        progressSubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        overallProgressBar: {
            height: 10,
            backgroundColor: colors.lightGray,
            borderRadius: 5,
            overflow: 'hidden',
            marginBottom: theme_1.Spacing.sm,
        },
        overallProgressBackground: {
            flex: 1,
        },
        overallProgressFill: {
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 5,
        },
        progressPercent: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.primary,
            fontWeight: theme_1.FontWeights.semibold,
            textAlign: 'right',
        },
        categoryTabs: {
            paddingHorizontal: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
            gap: theme_1.Spacing.sm,
        },
        categoryTab: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.xl,
            backgroundColor: colors.cardBackground,
            marginRight: theme_1.Spacing.sm,
            borderWidth: 1,
            borderColor: colors.lightGray,
        },
        categoryTabActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        categoryTabText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.textSecondary,
            marginLeft: theme_1.Spacing.xs,
        },
        categoryTabTextActive: {
            color: '#FFFFFF',
        },
        scrollView: {
            flex: 1,
        },
        achievementsGrid: {
            paddingHorizontal: theme_1.Spacing.lg,
            paddingBottom: theme_1.Spacing.xxl,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.md,
        },
        achievementWrapper: {
            width: react_native_1.Platform.select({
                web: '47%',
                default: '100%',
            }),
        },
    });
};
