"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WeakAreaCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
function WeakAreaCard(_a) {
    var weakArea = _a.weakArea, rank = _a.rank;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var router = (0, expo_router_1.useRouter)();
    var styles = getStyles(colors, isDark);
    var getAccuracyColor = function (accuracy) {
        if (accuracy < 40)
            return colors.error;
        if (accuracy < 55)
            return colors.warning;
        return colors.warning;
    };
    var getTrendIcon = function (trend) {
        switch (trend) {
            case 'improving':
                return '📈';
            case 'declining':
                return '📉';
            default:
                return '➡️';
        }
    };
    var getSeverityBadge = function (accuracy) {
        if (accuracy < 40)
            return 'Needs Focus';
        if (accuracy < 55)
            return 'Needs Practice';
        return 'Review';
    };
    var handleFocus = function () {
        // Navigate to the lesson/chapter for this weak area
        router.push({
            pathname: '/chapters',
            params: {
                subject: weakArea.subject,
            },
        });
    };
    return (<react_native_1.View style={styles.card}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.rankContainer}>
          <react_native_1.Text style={styles.rankText}>#{rank}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.headerContent}>
          <react_native_1.Text style={styles.topic}>{weakArea.topic}</react_native_1.Text>
          <react_native_1.Text style={styles.context}>
            {weakArea.subject} • {weakArea.chapter}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.trendContainer}>
          <react_native_1.Text style={styles.trendIcon}>{getTrendIcon(weakArea.trend)}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.statsRow}>
        <react_native_1.View style={styles.statItem}>
          <react_native_1.Text style={styles.statLabel}>Accuracy</react_native_1.Text>
          <react_native_1.Text style={[styles.statValue, { color: getAccuracyColor(weakArea.accuracy) }]}>
            {weakArea.accuracy}%
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.statDivider}/>
        <react_native_1.View style={styles.statItem}>
          <react_native_1.Text style={styles.statLabel}>Attempts</react_native_1.Text>
          <react_native_1.Text style={styles.statValue}>{weakArea.totalAttempts}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.statDivider}/>
        <react_native_1.View style={styles.statItem}>
          <react_native_1.Text style={styles.statLabel}>Mistakes</react_native_1.Text>
          <react_native_1.Text style={styles.statValue}>{weakArea.mistakes}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.progressBarContainer}>
        <react_native_1.View style={styles.progressBarBackground}>
          <react_native_1.View style={[
            styles.progressBarFill,
            {
                width: "".concat(weakArea.accuracy, "%"),
                backgroundColor: getAccuracyColor(weakArea.accuracy),
            },
        ]}/>
        </react_native_1.View>
        <react_native_1.Text style={styles.progressLabel}>{getSeverityBadge(weakArea.accuracy)}</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.TouchableOpacity style={styles.focusButton} onPress={handleFocus}>
        <react_native_1.Text style={styles.focusButtonText}>Focus on this topic →</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    rankContainer: {
        width: 36,
        height: 36,
        borderRadius: theme_1.BorderRadius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    rankText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.white,
    },
    headerContent: {
        flex: 1,
    },
    topic: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: 2,
    },
    context: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
    trendContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendIcon: {
        fontSize: theme_1.FontSizes.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    statValue: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.lightGray,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: theme_1.BorderRadius.full,
        overflow: 'hidden',
        marginRight: theme_1.Spacing.md,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: theme_1.BorderRadius.full,
    },
    progressLabel: {
        fontSize: theme_1.FontSizes.xs,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.textSecondary,
    },
    focusButton: {
        backgroundColor: colors.primary,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        alignItems: 'center',
    },
    focusButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
}); };
