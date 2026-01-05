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
exports.default = ExamCountdownWidget;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var ExamService_1 = require("@/services/ExamService");
var vector_icons_1 = require("@expo/vector-icons");
function ExamCountdownWidget(_a) {
    var _this = this;
    var _b = _a.limit, limit = _b === void 0 ? 3 : _b, _c = _a.showTitle, showTitle = _c === void 0 ? true : _c;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _d = (0, react_1.useState)([]), exams = _d[0], setExams = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    (0, react_1.useEffect)(function () {
        loadExams();
        // Refresh countdown daily
        var interval = setInterval(function () {
            loadExams();
        }, 60000 * 60 * 24); // 24 hours
        return function () { return clearInterval(interval); };
    }, []);
    var loadExams = function () { return __awaiter(_this, void 0, void 0, function () {
        var upcomingExams, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    return [4 /*yield*/, ExamService_1.examService.initialize()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ExamService_1.examService.refreshExamUrgency()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ExamService_1.examService.getUpcomingExams(limit)];
                case 3:
                    upcomingExams = _a.sent();
                    setExams(upcomingExams);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to load exams:', error_1);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var getDaysRemaining = function (examDate) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var exam = new Date(examDate);
        exam.setHours(0, 0, 0, 0);
        var diffTime = exam.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    var getUrgencyColors = function (color) {
        if (color === 'red') {
            return {
                bg: '#FFEBEE',
                text: '#C62828',
                border: '#EF9A9A',
            };
        }
        if (color === 'yellow') {
            return {
                bg: '#FFF8E1',
                text: '#F57C00',
                border: '#FFCC80',
            };
        }
        return {
            bg: '#E8F5E9',
            text: '#2E7D32',
            border: '#A5D6A7',
        };
    };
    var handleExamPress = function (exam) {
        router.push({
            pathname: '/exam-details',
            params: { examId: exam.id },
        });
    };
    var handleAddExam = function () {
        router.push('/exam-details');
    };
    var styles = getStyles(colors);
    if (loading) {
        return (<react_native_1.View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <react_native_1.Text style={styles.loadingText}>Loading exams...</react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      {showTitle && (<react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Upcoming Exams</react_native_1.Text>
          <react_native_1.TouchableOpacity style={styles.addButton} onPress={handleAddExam} activeOpacity={0.7}>
            <vector_icons_1.Feather name="plus" size={18} color={colors.primary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>)}

      {exams.length === 0 ? (<react_native_1.View style={styles.emptyState}>
          <react_native_1.Text style={styles.emptyEmoji}>📅</react_native_1.Text>
          <react_native_1.Text style={styles.emptyTitle}>No Upcoming Exams</react_native_1.Text>
          <react_native_1.Text style={styles.emptyText}>
            Add your exams to track countdown
          </react_native_1.Text>
          <react_native_1.TouchableOpacity style={styles.addExamButton} onPress={handleAddExam} activeOpacity={0.8}>
            <vector_icons_1.Feather name="plus" size={16} color="#FFFFFF"/>
            <react_native_1.Text style={styles.addExamButtonText}>Add Exam</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>) : (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {exams.map(function (exam) {
                var daysRemaining = getDaysRemaining(exam.date);
                var urgencyColors = getUrgencyColors(exam.color);
                return (<react_native_1.TouchableOpacity key={exam.id} style={[
                        styles.examCard,
                        { borderColor: urgencyColors.border },
                    ]} onPress={function () { return handleExamPress(exam); }} activeOpacity={0.7}>
                <react_native_1.View style={[
                        styles.urgencyBadge,
                        { backgroundColor: urgencyColors.bg },
                    ]}>
                  <react_native_1.Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
                    {daysRemaining <= 0 ? 'Today' : daysRemaining === 1 ? 'Tomorrow' : "".concat(daysRemaining, " days")}
                  </react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.examContent}>
                  <react_native_1.Text style={styles.examName} numberOfLines={1}>
                    {exam.name}
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.examSubject}>{exam.subject}</react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.examDate}>
                  <vector_icons_1.Feather name="calendar" size={14} color={colors.textSecondary}/>
                  <react_native_1.Text style={styles.examDateText}>{exam.dateDisplay}</react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.progressBar}>
                  <react_native_1.View style={[
                        styles.progressFill,
                        {
                            width: "".concat(Math.min(100, Math.max(0, (daysRemaining / 30) * 100)), "%"),
                            backgroundColor: urgencyColors.border,
                        },
                    ]}/>
                </react_native_1.View>
              </react_native_1.TouchableOpacity>);
            })}
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
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        title: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        addButton: {
            padding: theme_1.Spacing.sm,
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.md,
        },
        loadingText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
            paddingVertical: theme_1.Spacing.md,
        },
        scrollContent: {
            gap: theme_1.Spacing.md,
        },
        examCard: {
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            minWidth: 180,
            maxWidth: 200,
            borderWidth: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        urgencyBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.md,
            marginBottom: theme_1.Spacing.sm,
        },
        urgencyText: {
            fontSize: theme_1.FontSizes.xs,
            fontWeight: theme_1.FontWeights.bold,
        },
        examContent: {
            marginBottom: theme_1.Spacing.sm,
        },
        examName: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.xs,
        },
        examSubject: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
        examDate: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.xs,
            marginBottom: theme_1.Spacing.md,
        },
        examDateText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
        },
        progressBar: {
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            borderRadius: 2,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.xl,
        },
        emptyEmoji: {
            fontSize: 48,
            marginBottom: theme_1.Spacing.md,
        },
        emptyTitle: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.xs,
        },
        emptyText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        addExamButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            paddingHorizontal: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
            gap: theme_1.Spacing.xs,
        },
        addExamButtonText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
    });
};
