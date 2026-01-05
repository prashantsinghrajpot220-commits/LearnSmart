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
exports.default = WeakAreasScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var MistakeAnalysisService_1 = require("@/services/MistakeAnalysisService");
var WeakAreaCard_1 = require("@/components/WeakAreaCard");
function WeakAreasScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var _b = (0, react_1.useState)([]), weakAreas = _b[0], setWeakAreas = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), refreshing = _d[0], setRefreshing = _d[1];
    var loadWeakAreas = function () { return __awaiter(_this, void 0, void 0, function () {
        var areas, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, MistakeAnalysisService_1.mistakeAnalysisService.identifyWeakAreas()];
                case 1:
                    areas = _a.sent();
                    setWeakAreas(areas);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        loadWeakAreas();
    }, []);
    var handleRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRefreshing(true);
                    return [4 /*yield*/, loadWeakAreas()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var styles = getStyles(colors, isDark);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.headerTitle}>Weak Areas Analysis</react_native_1.Text>
        <react_native_1.Text style={styles.headerSubtitle}>
          Topics where you need more practice
        </react_native_1.Text>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary}/>}>
        {loading ? (<react_native_1.View style={styles.centerContainer}>
            <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
            <react_native_1.Text style={styles.loadingText}>Analyzing your performance...</react_native_1.Text>
          </react_native_1.View>) : weakAreas.length === 0 ? (<react_native_1.View style={styles.centerContainer}>
            <react_native_1.Text style={styles.emptyIcon}>🎉</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>No Weak Areas Found!</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              You're doing great across all topics. Keep up the good work!
            </react_native_1.Text>
          </react_native_1.View>) : (<react_native_1.View style={styles.areasList}>
            {weakAreas.map(function (area, index) { return (<WeakAreaCard_1.default key={"".concat(area.subject, "-").concat(area.topic, "-").concat(index)} weakArea={area} rank={index + 1}/>); })}
          </react_native_1.View>)}
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingTop: theme_1.Spacing.xl,
        paddingBottom: theme_1.Spacing.md,
        backgroundColor: colors.cardBackground,
    },
    headerTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.xs,
    },
    headerSubtitle: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: theme_1.Spacing.lg,
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
    areasList: {
        gap: theme_1.Spacing.md,
    },
}); };
