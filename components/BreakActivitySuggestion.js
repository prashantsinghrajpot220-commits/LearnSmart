"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BreakActivitySuggestion;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var breakActivities_1 = require("@/data/breakActivities");
var vector_icons_1 = require("@expo/vector-icons");
function BreakActivitySuggestion(_a) {
    var _b = _a.breakDuration, breakDuration = _b === void 0 ? 5 : _b, onActivitySelect = _a.onActivitySelect;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _c = (0, react_1.useState)(null), currentActivity = _c[0], setCurrentActivity = _c[1];
    var _d = (0, react_1.useState)(false), showAll = _d[0], setShowAll = _d[1];
    var _e = (0, react_1.useState)([]), filteredActivities = _e[0], setFilteredActivities = _e[1];
    (0, react_1.useEffect)(function () {
        if (!showAll) {
            var randomActivity_1 = (0, breakActivities_1.getRandomBreakActivity)();
            setTimeout(function () {
                setCurrentActivity(randomActivity_1);
            }, 0);
        }
    }, [showAll]);
    var handleRefresh = function () {
        var randomActivity = (0, breakActivities_1.getRandomBreakActivity)();
        setCurrentActivity(randomActivity);
    };
    var handleViewAll = function () {
        // Filter activities by duration
        var filtered = breakActivities_1.breakActivities.filter(function (activity) { return activity.duration <= breakDuration; });
        setFilteredActivities(filtered);
        setShowAll(true);
    };
    var handleActivityPress = function (activity) {
        if (onActivitySelect) {
            onActivitySelect(activity);
        }
    };
    var getCategoryIcon = function (category) {
        var icons = {
            physical: '🏃',
            mental: '🧘',
            creative: '🎨',
            social: '👥',
        };
        return icons[category] || '💡';
    };
    var getCategoryColor = function (category) {
        var categoryColors = {
            physical: '#FF6B6B',
            mental: '#4ECDC4',
            creative: '#95E1D3',
            social: '#F38181',
        };
        return categoryColors[category] || colors.primary;
    };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.titleSection}>
          <react_native_1.Text style={styles.title}>Break Time!</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>
            {showAll ? 'Choose an activity' : 'Here\'s a suggestion'}
          </react_native_1.Text>
        </react_native_1.View>
        {!showAll && (<react_native_1.TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.7}>
            <vector_icons_1.Feather name="refresh-cw" size={18} color={colors.primary}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      {!showAll && currentActivity ? (<react_native_1.View style={styles.activityCard}>
          <react_native_1.View style={styles.activityHeader}>
            <react_native_1.View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(currentActivity.category) },
            ]}>
              <react_native_1.Text style={styles.categoryIcon}>{getCategoryIcon(currentActivity.category)}</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.activityMeta}>
              <react_native_1.View style={styles.durationBadge}>
                <vector_icons_1.Feather name="clock" size={12} color={colors.textSecondary}/>
                <react_native_1.Text style={styles.durationText}>{currentActivity.duration} min</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.Text style={styles.activityTitle}>{currentActivity.title}</react_native_1.Text>
          <react_native_1.Text style={styles.activityDescription}>
            {currentActivity.description}
          </react_native_1.Text>

          <react_native_1.TouchableOpacity style={styles.doneButton} onPress={function () { return handleActivityPress(currentActivity); }} activeOpacity={0.8}>
            <vector_icons_1.Feather name="check" size={18} color="#FFFFFF"/>
            <react_native_1.Text style={styles.doneButtonText}>Done!</react_native_1.Text>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll} activeOpacity={0.7}>
            <react_native_1.Text style={styles.viewAllButtonText}>View all activities</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={16} color={colors.primary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>) : (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activitiesList}>
          {filteredActivities.map(function (activity) { return (<react_native_1.TouchableOpacity key={activity.id} style={[styles.activityItem, { borderColor: getCategoryColor(activity.category) }]} onPress={function () { return handleActivityPress(activity); }} activeOpacity={0.8}>
              <react_native_1.View style={[
                    styles.activityItemIcon,
                    { backgroundColor: getCategoryColor(activity.category) },
                ]}>
                <react_native_1.Text style={styles.activityItemEmoji}>{activity.icon}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.activityItemTitle} numberOfLines={1}>
                {activity.title}
              </react_native_1.Text>
              <react_native_1.View style={styles.activityItemMeta}>
                <vector_icons_1.Feather name="clock" size={10} color={colors.textSecondary}/>
                <react_native_1.Text style={styles.activityItemDuration}>{activity.duration}m</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.ScrollView>)}
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: theme_1.Spacing.md,
        },
        titleSection: {
            flex: 1,
        },
        title: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.xs,
        },
        subtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
        refreshButton: {
            padding: theme_1.Spacing.sm,
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.md,
        },
        activityCard: {
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            borderWidth: 2,
            borderColor: colors.primary,
        },
        activityHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        categoryBadge: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        categoryIcon: {
            fontSize: 20,
        },
        activityMeta: {
            flexDirection: 'row',
            gap: theme_1.Spacing.sm,
        },
        durationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.xs,
            backgroundColor: colors.cardBackground,
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.sm,
        },
        durationText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
        },
        activityTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        activityDescription: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: 20,
            marginBottom: theme_1.Spacing.lg,
        },
        doneButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            gap: theme_1.Spacing.sm,
            marginBottom: theme_1.Spacing.sm,
        },
        doneButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
        viewAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: theme_1.Spacing.sm,
            gap: theme_1.Spacing.xs,
        },
        viewAllButtonText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.primary,
        },
        activitiesList: {
            gap: theme_1.Spacing.md,
        },
        activityItem: {
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            minWidth: 140,
            maxWidth: 160,
            borderWidth: 2,
            alignItems: 'center',
        },
        activityItemIcon: {
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        activityItemEmoji: {
            fontSize: 24,
        },
        activityItemTitle: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.xs,
        },
        activityItemMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.xs,
        },
        activityItemDuration: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
        },
    });
};
