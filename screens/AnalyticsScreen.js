"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var AnalyticsService_1 = require("@/services/AnalyticsService");
var PerformanceChart_1 = require("@/components/PerformanceChart");
function AnalyticsScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var _b = (0, react_1.useState)(null), metrics = _b[0], setMetrics = _b[1];
    var _c = (0, react_1.useState)([]), topicPerformance = _c[0], setTopicPerformance = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)('overview'), selectedTab = _e[0], setSelectedTab = _e[1];
    (0, react_1.useEffect)(function () {
        loadAnalytics();
    }, []);
    var loadAnalytics = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, performanceMetrics, topics, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            Promise.resolve(AnalyticsService_1.analyticsService.getPerformanceMetrics()),
                            Promise.resolve(AnalyticsService_1.analyticsService.getTopicPerformance()),
                        ])];
                case 1:
                    _a = _b.sent(), performanceMetrics = _a[0], topics = _a[1];
                    setMetrics(performanceMetrics);
                    setTopicPerformance(topics);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var styles = getStyles(colors, isDark);
    if (loading) {
        return (<react_native_1.View style={[styles.container, styles.centerContainer]}>
        <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        <react_native_1.Text style={styles.loadingText}>Loading analytics...</react_native_1.Text>
      </react_native_1.View>);
    }
    if (!metrics) {
        return (<react_native_1.View style={[styles.container, styles.centerContainer]}>
        <react_native_1.Text style={styles.emptyTitle}>No Data Yet</react_native_1.Text>
        <react_native_1.Text style={styles.emptyText}>
          Take some quizzes to see your analytics!
        </react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.headerTitle}>Your Analytics</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            Track your learning progress
          </react_native_1.Text>
        </react_native_1.View>

        {/* Tabs */}
        <react_native_1.View style={styles.tabs}>
          <react_native_1.TouchableOpacity style={[styles.tab, selectedTab === 'overview' && styles.activeTab]} onPress={function () { return setSelectedTab('overview'); }}>
            <react_native_1.Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={[styles.tab, selectedTab === 'topics' && styles.activeTab]} onPress={function () { return setSelectedTab('topics'); }}>
            <react_native_1.Text style={[styles.tabText, selectedTab === 'topics' && styles.activeTabText]}>
              Topics
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {selectedTab === 'overview' ? (<>
            {/* Key Metrics */}
            <react_native_1.View style={styles.metricsGrid}>
              <react_native_1.View style={styles.metricCard}>
                <react_native_1.Text style={styles.metricLabel}>Accuracy</react_native_1.Text>
                <react_native_1.Text style={styles.metricValue}>{metrics.overallAccuracy}%</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metricCard}>
                <react_native_1.Text style={styles.metricLabel}>Quizzes</react_native_1.Text>
                <react_native_1.Text style={styles.metricValue}>{metrics.quizzesTaken}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metricCard}>
                <react_native_1.Text style={styles.metricLabel}>Questions</react_native_1.Text>
                <react_native_1.Text style={styles.metricValue}>{metrics.totalQuestionsAttempted}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metricCard}>
                <react_native_1.Text style={styles.metricLabel}>Avg Score</react_native_1.Text>
                <react_native_1.Text style={styles.metricValue}>{metrics.averageScore}%</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {/* Performance Chart */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>Performance Trend</react_native_1.Text>
              <PerformanceChart_1.default />
            </react_native_1.View>

            {/* Insights */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>Insights</react_native_1.Text>
              <react_native_1.View style={styles.insightsList}>
                {AnalyticsService_1.analyticsService.getInsights().map(function (insight, index) { return (<react_native_1.View key={index} style={styles.insightItem}>
                    <react_native_1.Text style={styles.insightBullet}>•</react_native_1.Text>
                    <react_native_1.Text style={styles.insightText}>{insight}</react_native_1.Text>
                  </react_native_1.View>); })}
              </react_native_1.View>
            </react_native_1.View>
          </>) : (<>
            {/* Topic Performance */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>Topic Performance</react_native_1.Text>
              {topicPerformance.length === 0 ? (<react_native_1.Text style={styles.emptyText}>
                  No topic data available yet
                </react_native_1.Text>) : (topicPerformance.slice(0, 10).map(function (topic, index) { return (<react_native_1.View key={index} style={styles.topicCard}>
                    <react_native_1.View style={styles.topicHeader}>
                      <react_native_1.Text style={styles.topicName}>{topic.topic}</react_native_1.Text>
                      <react_native_1.Text style={styles.topicAccuracy}>{topic.accuracy}%</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.topicMeta}>
                      <react_native_1.Text style={styles.topicMetaText}>
                        {topic.subject} • {topic.chapter}
                      </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.topicProgressBar}>
                      <react_native_1.View style={[
                    styles.topicProgressFill,
                    {
                        width: "".concat(topic.accuracy, "%"),
                        backgroundColor: topic.accuracy >= 70
                            ? colors.success
                            : topic.accuracy >= 50
                                ? colors.warning
                                : colors.error,
                    },
                ]}/>
                    </react_native_1.View>
                  </react_native_1.View>); }))}
            </react_native_1.View>
          </>)}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxl,
    },
    loadingText: {
        marginTop: theme_1.Spacing.md,
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
    },
    emptyTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.sm,
    },
    emptyText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: theme_1.Spacing.lg,
    },
    header: {
        marginBottom: theme_1.Spacing.lg,
    },
    headerTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.xs,
    },
    headerSubtitle: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xs,
        marginBottom: theme_1.Spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.text,
    },
    activeTabText: {
        color: colors.white,
        fontWeight: theme_1.FontWeights.semibold,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme_1.Spacing.md,
        marginBottom: theme_1.Spacing.lg,
    },
    metricCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
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
    metricLabel: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        marginBottom: theme_1.Spacing.xs,
    },
    metricValue: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.primary,
    },
    section: {
        marginBottom: theme_1.Spacing.xl,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.md,
    },
    insightsList: {
        gap: theme_1.Spacing.sm,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    insightBullet: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.primary,
        marginRight: theme_1.Spacing.sm,
        lineHeight: theme_1.FontSizes.lg * 1.4,
    },
    insightText: {
        flex: 1,
        fontSize: theme_1.FontSizes.sm,
        color: colors.text,
        lineHeight: theme_1.FontSizes.sm * 1.5,
    },
    topicCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        marginBottom: theme_1.Spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme_1.Spacing.xs,
    },
    topicName: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        flex: 1,
    },
    topicAccuracy: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.primary,
    },
    topicMeta: {
        marginBottom: theme_1.Spacing.sm,
    },
    topicMetaText: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
    },
    topicProgressBar: {
        height: 6,
        backgroundColor: colors.lightGray,
        borderRadius: theme_1.BorderRadius.full,
        overflow: 'hidden',
    },
    topicProgressFill: {
        height: '100%',
        borderRadius: theme_1.BorderRadius.full,
    },
}); };
