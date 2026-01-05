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
exports.default = LeaderboardScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var userStore_1 = require("@/store/userStore");
var LeaderboardService_1 = require("@/services/LeaderboardService");
var LeaderboardCard_1 = require("@/components/LeaderboardCard");
var theme_1 = require("@/constants/theme");
var vector_icons_1 = require("@expo/vector-icons");
function LeaderboardScreen() {
    var _this = this;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var userId = (0, userStore_1.useUserStore)().userId;
    var _a = (0, react_1.useState)(null), leaderboard = _a[0], setLeaderboard = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), refreshing = _c[0], setRefreshing = _c[1];
    var _d = (0, react_1.useState)(false), showPreviousWeek = _d[0], setShowPreviousWeek = _d[1];
    var loadLeaderboard = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, 5, 6]);
                    setLoading(true);
                    if (!showPreviousWeek) return [3 /*break*/, 1];
                    _a = LeaderboardService_1.leaderboardService.getPreviousWeekLeaderboard();
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, LeaderboardService_1.leaderboardService.getLeaderboard()];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    data = _a;
                    setLeaderboard(data);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _b.sent();
                    // Debug statement removed
                    react_native_1.Alert.alert('Error', 'Failed to load leaderboard data');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [showPreviousWeek]);
    var onRefresh = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRefreshing(true);
                    return [4 /*yield*/, loadLeaderboard()];
                case 1:
                    _a.sent();
                    setRefreshing(false);
                    return [2 /*return*/];
            }
        });
    }); }, [loadLeaderboard]);
    react_1.default.useEffect(function () {
        loadLeaderboard();
    }, [loadLeaderboard]);
    var handleWeekToggle = function () {
        setShowPreviousWeek(!showPreviousWeek);
    };
    var getUserRank = function () {
        var _a;
        if (!leaderboard)
            return 0;
        return ((_a = leaderboard.entries.find(function (entry) { return entry.userId === userId; })) === null || _a === void 0 ? void 0 : _a.rank) || 0;
    };
    var getTopEntries = function () {
        if (!leaderboard)
            return [];
        return leaderboard.entries.slice(0, 10);
    };
    var getCurrentUserEntry = function () {
        if (!leaderboard)
            return null;
        return leaderboard.entries.find(function (entry) { return entry.userId === userId; });
    };
    var styles = getStyles(colors);
    if (loading && !leaderboard) {
        return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <react_native_1.View style={styles.loadingContainer}>
          <react_native_1.Text style={[styles.loadingText, { color: colors.text }]}>
            Loading leaderboard...
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.SafeAreaView>);
    }
    var currentUserEntry = getCurrentUserEntry();
    var userRank = getUserRank();
    var topEntries = getTopEntries();
    var timeUntilReset = LeaderboardService_1.leaderboardService.getTimeUntilNextReset();
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.ScrollView style={styles.scrollView} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={[styles.title, { color: colors.text }]}>
            {showPreviousWeek ? 'Last Week' : 'This Week'} Leaderboard
          </react_native_1.Text>
          <react_native_1.Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Resets in {timeUntilReset}
          </react_native_1.Text>
        </react_native_1.View>

        {/* Week Toggle */}
        <react_native_1.View style={styles.weekToggleContainer}>
          <react_native_1.TouchableOpacity style={[
            styles.weekToggleButton,
            {
                backgroundColor: !showPreviousWeek ? colors.primary : colors.cardBackground,
                borderColor: colors.primary
            }
        ]} onPress={function () { return setShowPreviousWeek(false); }}>
            <react_native_1.Text style={[
            styles.weekToggleText,
            { color: !showPreviousWeek ? 'white' : colors.text }
        ]}>
              This Week
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={[
            styles.weekToggleButton,
            {
                backgroundColor: showPreviousWeek ? colors.primary : colors.cardBackground,
                borderColor: colors.primary
            }
        ]} onPress={function () { return setShowPreviousWeek(true); }}>
            <react_native_1.Text style={[
            styles.weekToggleText,
            { color: showPreviousWeek ? 'white' : colors.text }
        ]}>
              Last Week
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* User Stats Card */}
        {currentUserEntry && (<react_native_1.View style={[styles.userStatsCard, { backgroundColor: colors.cardBackground }]}>
            <react_native_1.Text style={[styles.userStatsTitle, { color: colors.text }]}>
              Your Performance
            </react_native_1.Text>
            <react_native_1.View style={styles.userStatsRow}>
              <react_native_1.View style={styles.userStatItem}>
                <react_native_1.Text style={[styles.userStatValue, { color: '#B2AC88' }]}>
                  #{userRank}
                </react_native_1.Text>
                <react_native_1.Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Your Rank
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.userStatItem}>
                <react_native_1.Text style={[styles.userStatValue, { color: colors.text }]}>
                  {currentUserEntry.weeklyXP}
                </react_native_1.Text>
                <react_native_1.Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Weekly XP
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.userStatItem}>
                <react_native_1.Text style={[styles.userStatValue, { color: colors.text }]}>
                  🔥 {currentUserEntry.streak}
                </react_native_1.Text>
                <react_native_1.Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Streak
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            
            {/* Progress to next rank */}
            {userRank > 0 && (<react_native_1.View style={styles.rankProgress}>
                <react_native_1.Text style={[styles.rankProgressText, { color: colors.textSecondary }]}>
                  {userRank <= 10
                    ? '🎉 You\'re in the top 10!'
                    : leaderboard ? "".concat(LeaderboardService_1.leaderboardService.getXPToNextRank(leaderboard), " XP to next rank") : ''}
                </react_native_1.Text>
              </react_native_1.View>)}
          </react_native_1.View>)}

        {/* Top 10 Leaderboard */}
        <react_native_1.View style={styles.leaderboardContainer}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>
            🏆 Top 10 This Week
          </react_native_1.Text>
          
          {topEntries.length === 0 ? (<react_native_1.View style={styles.emptyState}>
              <vector_icons_1.MaterialCommunityIcons name="trophy-outline" size={64} color={colors.textSecondary}/>
              <react_native_1.Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No leaderboard data available
              </react_native_1.Text>
            </react_native_1.View>) : (topEntries.map(function (entry) { return (<LeaderboardCard_1.default key={entry.userId} entry={entry} isCurrentUser={entry.userId === userId} rank={entry.rank}/>); }))}
        </react_native_1.View>

        {/* Encouragement */}
        {userRank > 10 && (<react_native_1.View style={[styles.encouragementCard, { backgroundColor: colors.cardBackground }]}>
            <vector_icons_1.MaterialCommunityIcons name="trending-up" size={32} color={colors.primary}/>
            <react_native_1.Text style={[styles.encouragementText, { color: colors.text }]}>
              Keep going! You're {userRank - 10} spots away from the top 10.
            </react_native_1.Text>
          </react_native_1.View>)}

        {/* Bottom Spacing */}
        <react_native_1.View style={styles.bottomSpacing}/>
      </react_native_1.ScrollView>
    </react_native_1.SafeAreaView>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: theme_1.FontSizes.md,
    },
    header: {
        padding: theme_1.Spacing.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: theme_1.FontSizes.sm,
    },
    weekToggleContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.lg,
    },
    weekToggleButton: {
        flex: 1,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    weekToggleText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
    },
    userStatsCard: {
        margin: theme_1.Spacing.lg,
        padding: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
    },
    userStatsTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: theme_1.Spacing.md,
        textAlign: 'center',
    },
    userStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    userStatItem: {
        alignItems: 'center',
    },
    userStatValue: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
    },
    userStatLabel: {
        fontSize: theme_1.FontSizes.sm,
    },
    rankProgress: {
        marginTop: theme_1.Spacing.md,
        paddingTop: theme_1.Spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        alignItems: 'center',
    },
    rankProgressText: {
        fontSize: theme_1.FontSizes.sm,
        fontStyle: 'italic',
    },
    leaderboardContainer: {
        paddingHorizontal: theme_1.Spacing.lg,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: theme_1.Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme_1.Spacing.xl,
    },
    emptyStateText: {
        fontSize: theme_1.FontSizes.md,
        marginTop: theme_1.Spacing.md,
        textAlign: 'center',
    },
    encouragementCard: {
        margin: theme_1.Spacing.lg,
        padding: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
    },
    encouragementText: {
        fontSize: theme_1.FontSizes.md,
        textAlign: 'center',
        marginTop: theme_1.Spacing.sm,
    },
    bottomSpacing: {
        height: theme_1.Spacing.xl,
    },
}); };
