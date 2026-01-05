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
exports.default = PersonalizedPlanScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var MistakeAnalysisService_1 = require("@/services/MistakeAnalysisService");
function PersonalizedPlanScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var _b = (0, react_1.useState)(null), plan = _b[0], setPlan = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(new Set()), expandedDays = _d[0], setExpandedDays = _d[1];
    var loadPlan = function () { return __awaiter(_this, void 0, void 0, function () {
        var studyPlan, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, MistakeAnalysisService_1.mistakeAnalysisService.generatePersonalizedStudyPlan()];
                case 1:
                    studyPlan = _a.sent();
                    setPlan(studyPlan);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        loadPlan();
    }, []);
    var toggleDay = function (day) {
        var newExpanded = new Set(expandedDays);
        if (newExpanded.has(day)) {
            newExpanded.delete(day);
        }
        else {
            newExpanded.add(day);
        }
        setExpandedDays(newExpanded);
    };
    var styles = getStyles(colors, isDark);
    if (loading) {
        return (<react_native_1.View style={[styles.container, styles.centerContainer]}>
        <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        <react_native_1.Text style={styles.loadingText}>Creating your personalized plan...</react_native_1.Text>
      </react_native_1.View>);
    }
    if (!plan || plan.weakAreas.length === 0) {
        return (<react_native_1.View style={[styles.container, styles.centerContainer]}>
        <react_native_1.Text style={styles.emptyIcon}>🌟</react_native_1.Text>
        <react_native_1.Text style={styles.emptyTitle}>No Study Plan Needed!</react_native_1.Text>
        <react_native_1.Text style={styles.emptyText}>
          You're performing excellently. Keep up the great work!
        </react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.headerTitle}>Your Personalized Study Plan</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            {plan.estimatedCompletionDays}-day plan tailored for you
          </react_native_1.Text>
        </react_native_1.View>

        {/* Priority Topics */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={styles.sectionTitle}>Priority Topics</react_native_1.Text>
          <react_native_1.View style={styles.priorityContainer}>
            {plan.priorityTopics.map(function (topic, index) { return (<react_native_1.View key={index} style={styles.priorityTag}>
                <react_native_1.Text style={styles.priorityTagText}>{topic}</react_native_1.Text>
              </react_native_1.View>); })}
          </react_native_1.View>
        </react_native_1.View>

        {/* Weekly Schedule */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={styles.sectionTitle}>Study Schedule</react_native_1.Text>
          {plan.suggestedSchedule.map(function (dayPlan) { return (<react_native_1.View key={dayPlan.day} style={styles.dayCard}>
              <react_native_1.TouchableOpacity style={styles.dayHeader} onPress={function () { return toggleDay(dayPlan.day); }}>
                <react_native_1.View style={styles.dayInfo}>
                  <react_native_1.Text style={styles.dayNumber}>Day {dayPlan.day}</react_native_1.Text>
                  <react_native_1.Text style={styles.dayTopic}>{dayPlan.topic}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.dayTime}>{dayPlan.estimatedTime} min</react_native_1.Text>
                <react_native_1.Text style={styles.expandIcon}>
                  {expandedDays.has(dayPlan.day) ? '▼' : '▶'}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>
              {expandedDays.has(dayPlan.day) && (<react_native_1.View style={styles.dayActivities}>
                  <react_native_1.Text style={styles.activitiesLabel}>Activities:</react_native_1.Text>
                  {dayPlan.activities.map(function (activity, index) { return (<react_native_1.View key={index} style={styles.activityItem}>
                      <react_native_1.Text style={styles.activityBullet}>•</react_native_1.Text>
                      <react_native_1.Text style={styles.activityText}>{activity}</react_native_1.Text>
                    </react_native_1.View>); })}
                </react_native_1.View>)}
            </react_native_1.View>); })}
        </react_native_1.View>

        {/* Call to Action */}
        <react_native_1.TouchableOpacity style={styles.startButton}>
          <react_native_1.Text style={styles.startButtonText}>Start Today's Plan</react_native_1.Text>
        </react_native_1.TouchableOpacity>
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
    emptyIcon: {
        fontSize: 64,
        marginBottom: theme_1.Spacing.lg,
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
        marginBottom: theme_1.Spacing.xl,
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
    section: {
        marginBottom: theme_1.Spacing.xl,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.md,
    },
    priorityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme_1.Spacing.sm,
    },
    priorityTag: {
        backgroundColor: colors.primary,
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
    },
    priorityTagText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.white,
    },
    dayCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        marginBottom: theme_1.Spacing.md,
        overflow: 'hidden',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.md,
    },
    dayInfo: {
        flex: 1,
    },
    dayNumber: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.primary,
        marginBottom: 2,
    },
    dayTopic: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
    },
    dayTime: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        marginRight: theme_1.Spacing.md,
    },
    expandIcon: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
    },
    dayActivities: {
        paddingHorizontal: theme_1.Spacing.md,
        paddingBottom: theme_1.Spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: theme_1.Spacing.md,
    },
    activitiesLabel: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.textSecondary,
        marginBottom: theme_1.Spacing.sm,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme_1.Spacing.sm,
    },
    activityBullet: {
        fontSize: theme_1.FontSizes.md,
        color: colors.primary,
        marginRight: theme_1.Spacing.sm,
        lineHeight: theme_1.FontSizes.md * 1.4,
    },
    activityText: {
        flex: 1,
        fontSize: theme_1.FontSizes.sm,
        color: colors.text,
        lineHeight: theme_1.FontSizes.sm * 1.4,
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingVertical: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        marginTop: theme_1.Spacing.md,
    },
    startButtonText: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.white,
    },
}); };
