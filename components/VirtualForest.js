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
exports.default = VirtualForest;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var FocusTracker_1 = require("@/services/FocusTracker");
var vector_icons_1 = require("@expo/vector-icons");
function VirtualForest(_a) {
    var _this = this;
    var sessionId = _a.sessionId, _b = _a.showHistory, showHistory = _b === void 0 ? false : _b;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _c = (0, react_1.useState)(0), currentGrowth = _c[0], setCurrentGrowth = _c[1];
    var _d = (0, react_1.useState)(false), isTreeAlive = _d[0], setIsTreeAlive = _d[1];
    var _e = (0, react_1.useState)('oak'), treeType = _e[0], setTreeType = _e[1];
    var _f = (0, react_1.useState)([]), recentTrees = _f[0], setRecentTrees = _f[1];
    var _g = (0, react_1.useState)({
        totalTrees: 0,
        treesThisWeek: 0,
        forestScore: 0,
    }), forestStats = _g[0], setForestStats = _g[1];
    var loadForestData = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var trees, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, FocusTracker_1.focusTracker.getRecentTrees(20)];
                case 1:
                    trees = _a.sent();
                    return [4 /*yield*/, FocusTracker_1.focusTracker.getForestStats()];
                case 2:
                    stats = _a.sent();
                    setRecentTrees(trees);
                    setForestStats(stats);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            loadForestData();
        }, 0);
        // Subscribe to growth updates
        var interval = setInterval(function () {
            if (sessionId) {
                setCurrentGrowth(FocusTracker_1.focusTracker.getCurrentGrowth());
                setIsTreeAlive(FocusTracker_1.focusTracker.isTreeAlive());
            }
        }, 500);
        return function () {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [sessionId, loadForestData]);
    var handleRestartTree = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sessionId) return [3 /*break*/, 2];
                    return [4 /*yield*/, FocusTracker_1.focusTracker.restartTree(sessionId)];
                case 1:
                    _a.sent();
                    setCurrentGrowth(0);
                    setIsTreeAlive(true);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var getTreeSize = function (growth) {
        var baseSize = 40;
        var maxSize = 100;
        return baseSize + (growth / 100) * (maxSize - baseSize);
    };
    var getTreeOpacity = function (growth, alive) {
        if (!alive)
            return 0.3;
        return 0.5 + (growth / 100) * 0.5;
    };
    var renderTree = function (tree, index, isCurrent) {
        if (isCurrent === void 0) { isCurrent = false; }
        var treeEmoji = FocusTracker_1.focusTracker.getTreeEmoji(tree.type);
        var size = isCurrent ? getTreeSize(currentGrowth) : getTreeSize(tree.growth);
        var opacity = isCurrent ? getTreeOpacity(currentGrowth, isTreeAlive) : getTreeOpacity(tree.growth, tree.alive);
        var isDead = isCurrent ? !isTreeAlive : !tree.alive;
        return (<react_native_1.View key={tree.id || index} style={[styles.treeContainer, { width: size + 20 }]}>
        <react_native_1.View style={[
                styles.tree,
                {
                    width: size,
                    height: size,
                    opacity: opacity,
                    transform: [{ scale: isDead ? 0.8 : 1 }],
                },
            ]}>
          <react_native_1.Text style={[styles.treeEmoji, { fontSize: size * 0.6 }]}>{treeEmoji}</react_native_1.Text>
          {isDead && <react_native_1.Text style={styles.deadIcon}>💀</react_native_1.Text>}
        </react_native_1.View>
        {!isCurrent && !isDead && tree.growth >= 100 && (<react_native_1.View style={styles.grownBadge}>
            <vector_icons_1.Feather name="check-circle" size={12} color="#4CAF50"/>
          </react_native_1.View>)}
      </react_native_1.View>);
    };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      {/* Forest Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.View>
          <react_native_1.Text style={styles.title}>Virtual Forest</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>
            {isTreeAlive
            ? 'Stay focused to grow your tree!'
            : 'Tree died • Restart to try again'}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.statsContainer}>
          <react_native_1.View style={styles.statItem}>
            <react_native_1.Text style={styles.statValue}>{forestStats.treesThisWeek}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>This Week</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.statDivider}/>
          <react_native_1.View style={styles.statItem}>
            <react_native_1.Text style={styles.statValue}>{forestStats.totalTrees}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Total</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      {/* Current Growing Tree */}
      {sessionId && (<react_native_1.View style={styles.currentTreeSection}>
          <react_native_1.Text style={styles.sectionTitle}>Growing Now</react_native_1.Text>
          <react_native_1.View style={styles.currentTreeContainer}>
            {isTreeAlive ? (<react_native_1.View style={styles.growingTreeWrapper}>
                <react_native_1.View style={[
                    styles.growingTree,
                    {
                        width: 120,
                        height: 120,
                    },
                ]}>
                  <react_native_1.Text style={[styles.growingTreeEmoji, { fontSize: 80 }]}>
                    {FocusTracker_1.focusTracker.getTreeEmoji(treeType)}
                  </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.growthIndicator}>
                  <react_native_1.View style={styles.growthBarBackground}>
                    <react_native_1.View style={[
                    styles.growthBarFill,
                    {
                        width: "".concat(currentGrowth, "%"),
                        backgroundColor: colors.primary,
                    },
                ]}/>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.growthText}>{Math.round(currentGrowth)}%</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>) : (<react_native_1.View style={styles.deadTreeWrapper}>
                <react_native_1.Text style={styles.deadTreeEmoji}>🍂</react_native_1.Text>
                <react_native_1.Text style={styles.deadText}>Oh no! Your tree died.</react_native_1.Text>
                <react_native_1.TouchableOpacity style={styles.restartButton} onPress={handleRestartTree} activeOpacity={0.8}>
                  <vector_icons_1.Feather name="refresh-ccw" size={18} color="#FFFFFF"/>
                  <react_native_1.Text style={styles.restartButtonText}>Restart</react_native_1.Text>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>)}
          </react_native_1.View>
        </react_native_1.View>)}

      {/* Forest History */}
      {showHistory && recentTrees.length > 0 && (<react_native_1.View style={styles.historySection}>
          <react_native_1.View style={styles.historyHeader}>
            <react_native_1.Text style={styles.sectionTitle}>Your Forest</react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.refreshButton} onPress={loadForestData} activeOpacity={0.7}>
              <vector_icons_1.Feather name="refresh-cw" size={16} color={colors.textSecondary}/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forestGrid}>
            {recentTrees.map(function (tree, index) { return renderTree(tree, index); })}
          </react_native_1.ScrollView>
        </react_native_1.View>)}

      {/* Empty State */}
      {showHistory && recentTrees.length === 0 && (<react_native_1.View style={styles.emptyState}>
          <react_native_1.Text style={styles.emptyEmoji}>🌱</react_native_1.Text>
          <react_native_1.Text style={styles.emptyTitle}>Start Your Forest</react_native_1.Text>
          <react_native_1.Text style={styles.emptyText}>
            Complete focus sessions to grow your first tree!
          </react_native_1.Text>
        </react_native_1.View>)}
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
            marginBottom: theme_1.Spacing.lg,
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
            maxWidth: 180,
        },
        statsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.md,
            padding: theme_1.Spacing.sm,
            gap: theme_1.Spacing.sm,
        },
        statItem: {
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.sm,
        },
        statDivider: {
            width: 1,
            height: 30,
            backgroundColor: colors.border,
        },
        statValue: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.primary,
        },
        statLabel: {
            fontSize: 10,
            color: colors.textSecondary,
        },
        currentTreeSection: {
            marginBottom: theme_1.Spacing.lg,
        },
        sectionTitle: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.md,
        },
        currentTreeContainer: {
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
        },
        growingTreeWrapper: {
            alignItems: 'center',
        },
        growingTree: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.lg,
        },
        growingTreeEmoji: {
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        growthIndicator: {
            width: '100%',
            alignItems: 'center',
        },
        growthBarBackground: {
            width: '100%',
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: theme_1.Spacing.xs,
        },
        growthBarFill: {
            height: '100%',
            borderRadius: 4,
        },
        growthText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.textSecondary,
        },
        deadTreeWrapper: {
            alignItems: 'center',
        },
        deadTreeEmoji: {
            fontSize: 80,
            marginBottom: theme_1.Spacing.md,
            opacity: 0.5,
        },
        deadText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.lg,
        },
        restartButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            paddingHorizontal: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.xl,
            gap: theme_1.Spacing.sm,
        },
        restartButtonText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
        historySection: {
            marginTop: theme_1.Spacing.lg,
        },
        historyHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        refreshButton: {
            padding: theme_1.Spacing.xs,
        },
        forestGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.sm,
            paddingHorizontal: theme_1.Spacing.xs,
        },
        treeContainer: {
            alignItems: 'center',
            position: 'relative',
        },
        tree: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            borderRadius: 100,
        },
        treeEmoji: {
            textAlign: 'center',
            lineHeight: 1,
        },
        deadIcon: {
            position: 'absolute',
            bottom: -5,
            right: -5,
            fontSize: 16,
        },
        grownBadge: {
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 2,
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
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
};
