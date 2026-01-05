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
exports.default = SessionHistoryScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var TimerService_1 = require("@/services/TimerService");
var vector_icons_1 = require("@expo/vector-icons");
var SessionCard_1 = require("@/components/SessionCard");
function SessionHistoryScreen() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, react_1.useState)([]), sessions = _a[0], setSessions = _a[1];
    var _b = (0, react_1.useState)({
        totalSessions: 0,
        totalStudyTime: 0,
        averageFocusScore: 0,
        treesGrown: 0,
    }), stats = _b[0], setStats = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(7), filterDays = _d[0], setFilterDays = _d[1];
    (0, react_1.useEffect)(function () {
        loadSessions();
    }, [filterDays]);
    var loadSessions = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, sessionData, statsData, sortedSessions, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            TimerService_1.timerService.getSessionHistory(filterDays),
                            TimerService_1.timerService.getStats(filterDays),
                        ])];
                case 1:
                    _a = _b.sent(), sessionData = _a[0], statsData = _a[1];
                    sortedSessions = sessionData.sort(function (a, b) { return new Date(b.startTime).getTime() - new Date(a.startTime).getTime(); });
                    setSessions(sortedSessions);
                    setStats(statsData);
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
    var handleBack = function () {
        router.back();
    };
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    var getFocusScoreColor = function (score) {
        if (score >= 90)
            return colors.success;
        if (score >= 70)
            return '#8BC34A';
        if (score >= 50)
            return colors.warning;
        return colors.error;
    };
    var styles = getStyles(colors);
    if (loading) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.header}>
          <react_native_1.TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.headerTitle}>Session History</react_native_1.Text>
          <react_native_1.View style={styles.headerSpacer}/>
        </react_native_1.View>
        <react_native_1.View style={styles.loadingContainer}>
          <react_native_1.Text style={styles.loadingText}>Loading sessions...</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={styles.headerTitle}>Session History</react_native_1.Text>
        <react_native_1.View style={styles.headerSpacer}/>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats Overview */}
        <react_native_1.View style={styles.statsContainer}>
          <react_native_1.View style={styles.statCard}>
            <vector_icons_1.Feather name="clock" size={24} color={colors.primary}/>
            <react_native_1.Text style={styles.statValue}>{stats.totalStudyTime}m</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Total Time</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.statCard}>
            <vector_icons_1.Feather name="target" size={24} color={colors.success}/>
            <react_native_1.Text style={styles.statValue}>{stats.averageFocusScore}%</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Avg Focus</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.statCard}>
            <vector_icons_1.Feather name="activity" size={24} color={colors.primary}/>
            <react_native_1.Text style={styles.statValue}>{stats.treesGrown}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Trees Grown</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.statCard}>
            <vector_icons_1.Feather name="target" size={24} color={colors.warning}/>
            <react_native_1.Text style={styles.statValue}>{stats.totalSessions}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Sessions</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Filter Options */}
        <react_native_1.View style={styles.filterContainer}>
          <react_native_1.Text style={styles.filterLabel}>Time Period:</react_native_1.Text>
          <react_native_1.View style={styles.filterButtons}>
            {[
            { label: '7 Days', value: 7 },
            { label: '14 Days', value: 14 },
            { label: '30 Days', value: 30 },
        ].map(function (option) { return (<react_native_1.TouchableOpacity key={option.value} style={[
                styles.filterButton,
                filterDays === option.value && styles.filterButtonActive,
            ]} onPress={function () { return setFilterDays(option.value); }} activeOpacity={0.8}>
                <react_native_1.Text style={[
                styles.filterButtonText,
                filterDays === option.value && styles.filterButtonTextActive,
            ]}>
                  {option.label}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>
        </react_native_1.View>

        {/* Sessions List */}
        <react_native_1.Text style={styles.sectionTitle}>Sessions</react_native_1.Text>

        {sessions.length === 0 ? (<react_native_1.View style={styles.emptyState}>
            <react_native_1.Text style={styles.emptyEmoji}>📊</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>No Sessions Yet</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              Start a Pomodoro session to track your progress
            </react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.startButton} onPress={function () { return router.back(); }} activeOpacity={0.8}>
              <vector_icons_1.Feather name="plus" size={18} color="#FFFFFF"/>
              <react_native_1.Text style={styles.startButtonText}>Start First Session</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>) : (sessions.map(function (session) { return (<SessionCard_1.default key={session.id} session={session} colors={colors}/>); }))}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme_1.Spacing.lg,
            paddingTop: 60,
            paddingBottom: theme_1.Spacing.md,
            backgroundColor: colors.background,
        },
        headerTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        backButton: {
            padding: theme_1.Spacing.sm,
        },
        headerSpacer: {
            width: 40,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: theme_1.Spacing.lg,
            paddingBottom: theme_1.Spacing.xxl,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
        },
        statsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.md,
            marginBottom: theme_1.Spacing.xl,
        },
        statCard: {
            flex: 1,
            minWidth: 140,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        statValue: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginTop: theme_1.Spacing.sm,
            marginBottom: theme_1.Spacing.xs,
        },
        statLabel: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        filterContainer: {
            marginBottom: theme_1.Spacing.lg,
        },
        filterLabel: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        filterButtons: {
            flexDirection: 'row',
            gap: theme_1.Spacing.sm,
        },
        filterButton: {
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
        },
        filterButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterButtonText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.text,
        },
        filterButtonTextActive: {
            color: colors.white,
        },
        sectionTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.md,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.xxl,
        },
        emptyEmoji: {
            fontSize: 64,
            marginBottom: theme_1.Spacing.lg,
        },
        emptyTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        emptyText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.xl,
        },
        startButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            paddingHorizontal: theme_1.Spacing.xl,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            gap: theme_1.Spacing.sm,
        },
        startButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
    });
};
