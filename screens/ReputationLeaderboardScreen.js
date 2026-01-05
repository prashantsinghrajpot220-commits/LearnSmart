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
exports.default = ReputationLeaderboardScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var ReputationService_1 = require("@/services/ReputationService");
var userStore_1 = require("@/store/userStore");
var LeaderboardEntry_1 = require("@/components/LeaderboardEntry");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
function ReputationLeaderboardScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    var _a = (0, userStore_1.useUserStore)(), userId = _a.userId, updateReputationRank = _a.updateReputationRank;
    var _b = (0, react_1.useState)('all-time'), period = _b[0], setPeriod = _b[1];
    var _c = (0, react_1.useState)([]), leaderboard = _c[0], setLeaderboard = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    function loadLeaderboard() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                    case 1:
                        _a.sent();
                        setLoading(true);
                        // In a real app, this would be an API call
                        setTimeout(function () {
                            var data = ReputationService_1.reputationService.generateMockLeaderboard(period);
                            setLeaderboard(data);
                            // Update user's rank if it's all-time
                            if (period === 'all-time') {
                                var userEntry = data.find(function (e) { return e.userId === userId; });
                                if (userEntry) {
                                    updateReputationRank(userEntry.rank);
                                }
                            }
                            setLoading(false);
                        }, 500);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        setTimeout(function () {
            loadLeaderboard();
        }, 0);
    }, [period]);
    var renderPeriodTab = function (tabPeriod, label) {
        var isActive = period === tabPeriod;
        return (<react_native_1.TouchableOpacity style={[
                styles.tab,
                { backgroundColor: isActive ? colors.primary : 'transparent' }
            ]} onPress={function () { return setPeriod(tabPeriod); }}>
        <react_native_1.Text style={[
                styles.tabText,
                { color: isActive ? 'white' : colors.textSecondary }
            ]}>
          {label}
        </react_native_1.Text>
      </react_native_1.TouchableOpacity>);
    };
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
          <vector_icons_1.Ionicons name="arrow-back" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={[styles.title, { color: colors.text }]}>Community Leaderboard</react_native_1.Text>
        <react_native_1.View style={{ width: 40 }}/>
      </react_native_1.View>

      <react_native_1.View style={[styles.tabsContainer, { backgroundColor: colors.border + '40' }]}>
        {renderPeriodTab('all-time', 'All Time')}
        {renderPeriodTab('monthly', 'Monthly')}
        {renderPeriodTab('weekly', 'Weekly')}
      </react_native_1.View>

      {loading ? (<react_native_1.View style={styles.centerContainer}>
          <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        </react_native_1.View>) : (<react_native_1.FlatList data={leaderboard} keyExtractor={function (item) { return item.userId; }} renderItem={function (_a) {
                var item = _a.item;
                return (<LeaderboardEntry_1.default entry={item} isCurrentUser={item.userId === userId}/>);
            }} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<react_native_1.View style={styles.centerContainer}>
              <react_native_1.Text style={{ color: colors.textSecondary }}>No data available</react_native_1.Text>
            </react_native_1.View>}/>)}
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.md,
    },
    backButton: {
        padding: theme_1.Spacing.xs,
    },
    title: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: theme_1.Spacing.md,
        marginBottom: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.full,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: theme_1.BorderRadius.full,
    },
    tabText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.semibold,
    },
    listContent: {
        paddingHorizontal: theme_1.Spacing.md,
        paddingBottom: theme_1.Spacing.xl,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme_1.Spacing.xl,
    },
});
