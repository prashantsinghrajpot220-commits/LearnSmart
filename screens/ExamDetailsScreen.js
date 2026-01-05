"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = ExamDetailsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var ExamService_1 = require("@/services/ExamService");
var vector_icons_1 = require("@expo/vector-icons");
function ExamDetailsScreen() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var params = (0, expo_router_1.useLocalSearchParams)();
    var _a = (0, react_1.useState)(null), exam = _a[0], setExam = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), showAddModal = _c[0], setShowAddModal = _c[1];
    var _d = (0, react_1.useState)(false), showEditModal = _d[0], setShowEditModal = _d[1];
    // Form state for adding/editing
    var _e = (0, react_1.useState)({
        name: '',
        subject: '',
        date: '',
    }), formData = _e[0], setFormData = _e[1];
    (0, react_1.useEffect)(function () {
        loadExam();
    }, [params.examId]);
    var loadExam = function () { return __awaiter(_this, void 0, void 0, function () {
        var examData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    setLoading(true);
                    if (!params.examId) return [3 /*break*/, 2];
                    return [4 /*yield*/, ExamService_1.examService.getExamById(params.examId)];
                case 1:
                    examData = _a.sent();
                    setExam(examData || null);
                    return [3 /*break*/, 3];
                case 2:
                    setExam(null);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleBack = function () {
        router.back();
    };
    var handleAddExam = function () { return __awaiter(_this, void 0, void 0, function () {
        var urgencyDaysRemaining, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!formData.name || !formData.subject || !formData.date) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    urgencyDaysRemaining = getDaysRemaining(formData.date) || 0;
                    return [4 /*yield*/, ExamService_1.examService.addExam({
                            name: formData.name,
                            subject: formData.subject,
                            date: formData.date,
                            dateDisplay: new Date(formData.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            }),
                            color: ExamService_1.examService.getUrgencyColor(urgencyDaysRemaining),
                            completed: false,
                            isPrePopulated: false,
                        })];
                case 2:
                    _a.sent();
                    setShowAddModal(false);
                    setFormData({ name: '', subject: '', date: '' });
                    router.back();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdateExam = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!exam || !formData.name || !formData.subject || !formData.date) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ExamService_1.examService.updateExam(exam.id, {
                            name: formData.name,
                            subject: formData.subject,
                            date: formData.date,
                            dateDisplay: new Date(formData.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            }),
                        })];
                case 2:
                    _a.sent();
                    setShowEditModal(false);
                    loadExam();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteExam = function () { return __awaiter(_this, void 0, void 0, function () {
        var success, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!exam)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ExamService_1.examService.deleteExam(exam.id)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        router.back();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleMarkCompleted = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!exam)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ExamService_1.examService.markExamCompleted(exam.id)];
                case 2:
                    _a.sent();
                    loadExam();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
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
    var styles = getStyles(colors);
    if (loading) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Text style={styles.loadingText}>Loading...</react_native_1.Text>
      </react_native_1.View>);
    }
    // Show add exam form if no examId provided
    if (!exam && !params.examId) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.header}>
          <react_native_1.TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.headerTitle}>Add Exam</react_native_1.Text>
          <react_native_1.View style={styles.headerSpacer}/>
        </react_native_1.View>

        <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <react_native_1.View style={styles.formCard}>
            <react_native_1.Text style={styles.formLabel}>Exam Name</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} placeholder="e.g., Mathematics Final" placeholderTextColor={colors.textSecondary} value={formData.name} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { name: text })); }}/>

            <react_native_1.Text style={styles.formLabel}>Subject</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} placeholder="e.g., Mathematics" placeholderTextColor={colors.textSecondary} value={formData.subject} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { subject: text })); }}/>

            <react_native_1.Text style={styles.formLabel}>Exam Date</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} placeholder="YYYY-MM-DD (e.g., 2025-03-15)" placeholderTextColor={colors.textSecondary} value={formData.date} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { date: text })); }}/>

            <react_native_1.TouchableOpacity style={styles.submitButton} onPress={handleAddExam} activeOpacity={0.8}>
              <vector_icons_1.Feather name="plus" size={20} color="#FFFFFF"/>
              <react_native_1.Text style={styles.submitButtonText}>Add Exam</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.View>);
    }
    if (!exam) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.header}>
          <react_native_1.TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.headerTitle}>Exam Details</react_native_1.Text>
          <react_native_1.View style={styles.headerSpacer}/>
        </react_native_1.View>
        <react_native_1.View style={styles.errorContainer}>
          <react_native_1.Text style={styles.errorText}>Exam not found</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    var daysRemaining = getDaysRemaining(exam.date);
    var urgencyColors = getUrgencyColors(exam.color);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <vector_icons_1.Feather name="arrow-left" size={24} color={colors.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={styles.headerTitle}>Exam Details</react_native_1.Text>
        {!exam.isPrePopulated && (<react_native_1.TouchableOpacity onPress={function () {
                setFormData({
                    name: exam.name,
                    subject: exam.subject,
                    date: exam.date,
                });
                setShowEditModal(true);
            }} style={styles.editButton} activeOpacity={0.7}>
            <vector_icons_1.Feather name="edit-2" size={20} color={colors.primary}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Exam Card */}
        <react_native_1.View style={styles.examCard}>
          <react_native_1.View style={[styles.urgencyBanner, { backgroundColor: urgencyColors.bg }]}>
            <react_native_1.Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
              {daysRemaining <= 0 ? 'Exam Today' : daysRemaining === 1 ? 'Tomorrow' : "".concat(daysRemaining, " days remaining")}
            </react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={styles.examContent}>
            <react_native_1.Text style={styles.examName}>{exam.name}</react_native_1.Text>
            <react_native_1.Text style={styles.examSubject}>{exam.subject}</react_native_1.Text>

            <react_native_1.View style={styles.examDetails}>
              <react_native_1.View style={styles.detailItem}>
                <vector_icons_1.Feather name="calendar" size={20} color={colors.primary}/>
                <react_native_1.Text style={styles.detailText}>{exam.dateDisplay}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {exam.completed && (<react_native_1.View style={styles.completedBadge}>
                <vector_icons_1.Feather name="check-circle" size={16} color="#4CAF50"/>
                <react_native_1.Text style={styles.completedText}>Completed</react_native_1.Text>
              </react_native_1.View>)}
          </react_native_1.View>
        </react_native_1.View>

        {/* Study Tips */}
        <react_native_1.View style={styles.tipsCard}>
          <react_native_1.Text style={styles.tipsTitle}>Study Tips</react_native_1.Text>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="clock" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>
              {daysRemaining > 30
            ? 'Start with a study schedule'
            : daysRemaining > 7
                ? 'Focus on weak areas'
                : 'Review and practice mock tests'}
            </react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="target" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>
              Use Pomodoro timer for focused study sessions
            </react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.tipItem}>
            <vector_icons_1.Feather name="refresh-cw" size={16} color={colors.primary}/>
            <react_native_1.Text style={styles.tipText}>
              Take regular breaks to maintain productivity
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Actions */}
        {!exam.completed && (<react_native_1.View style={styles.actionsContainer}>
            <react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleMarkCompleted} activeOpacity={0.8}>
              <vector_icons_1.Feather name="check" size={20} color="#FFFFFF"/>
              <react_native_1.Text style={styles.actionButtonText}>Mark as Completed</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            {!exam.isPrePopulated && (<react_native_1.TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteExam} activeOpacity={0.8}>
                <vector_icons_1.Feather name="trash-2" size={20} color="#FFFFFF"/>
                <react_native_1.Text style={styles.actionButtonText}>Delete Exam</react_native_1.Text>
              </react_native_1.TouchableOpacity>)}
          </react_native_1.View>)}
      </react_native_1.ScrollView>

      {/* Edit Modal */}
      <react_native_1.Modal visible={showEditModal} animationType="slide" transparent onRequestClose={function () { return setShowEditModal(false); }}>
        <react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContent}>
            <react_native_1.Text style={styles.modalTitle}>Edit Exam</react_native_1.Text>

            <react_native_1.Text style={styles.formLabel}>Exam Name</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={formData.name} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { name: text })); }}/>

            <react_native_1.Text style={styles.formLabel}>Subject</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={formData.subject} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { subject: text })); }}/>

            <react_native_1.Text style={styles.formLabel}>Exam Date (YYYY-MM-DD)</react_native_1.Text>
            <react_native_1.TextInput style={styles.input} value={formData.date} onChangeText={function (text) { return setFormData(__assign(__assign({}, formData), { date: text })); }}/>

            <react_native_1.View style={styles.modalButtons}>
              <react_native_1.TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={function () { return setShowEditModal(false); }} activeOpacity={0.8}>
                <react_native_1.Text style={styles.cancelButtonText}>Cancel</react_native_1.Text>
              </react_native_1.TouchableOpacity>
              <react_native_1.TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdateExam} activeOpacity={0.8}>
                <react_native_1.Text style={styles.saveButtonText}>Save</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
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
            paddingTop: react_native_1.Platform.select({ ios: 50, default: 20 }),
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
        editButton: {
            padding: theme_1.Spacing.sm,
        },
        headerSpacer: {
            width: 40,
        },
        loadingText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: theme_1.Spacing.xxl,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.xl,
        },
        errorText: {
            fontSize: theme_1.FontSizes.lg,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: theme_1.Spacing.lg,
            paddingBottom: theme_1.Spacing.xxl,
        },
        examCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            overflow: 'hidden',
            marginBottom: theme_1.Spacing.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        urgencyBanner: {
            padding: theme_1.Spacing.md,
            alignItems: 'center',
        },
        urgencyText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
        },
        examContent: {
            padding: theme_1.Spacing.xl,
            alignItems: 'center',
        },
        examName: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        examSubject: {
            fontSize: theme_1.FontSizes.lg,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.lg,
        },
        examDetails: {
            width: '100%',
            gap: theme_1.Spacing.md,
            marginBottom: theme_1.Spacing.md,
        },
        detailItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.md,
            backgroundColor: colors.background,
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
        },
        detailText: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            flex: 1,
        },
        completedBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.sm,
            backgroundColor: '#E8F5E9',
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
        },
        completedText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: '#4CAF50',
        },
        tipsCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
        },
        tipsTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.md,
        },
        tipItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: theme_1.Spacing.sm,
            marginBottom: theme_1.Spacing.md,
        },
        tipText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            flex: 1,
            lineHeight: 20,
        },
        actionsContainer: {
            gap: theme_1.Spacing.md,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            gap: theme_1.Spacing.sm,
        },
        deleteButton: {
            backgroundColor: colors.error,
        },
        actionButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
        formCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
        },
        formLabel: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
            marginTop: theme_1.Spacing.md,
        },
        input: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme_1.BorderRadius.md,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.md,
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
        },
        submitButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            gap: theme_1.Spacing.sm,
            marginTop: theme_1.Spacing.xl,
        },
        submitButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.xl,
        },
        modalContent: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.xl,
            width: '100%',
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.lg,
        },
        modalButtons: {
            flexDirection: 'row',
            gap: theme_1.Spacing.md,
            marginTop: theme_1.Spacing.xl,
        },
        modalButton: {
            flex: 1,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.md,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        cancelButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
        },
        saveButton: {
            backgroundColor: colors.primary,
        },
        saveButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
    });
};
