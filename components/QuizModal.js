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
exports.default = QuizModal;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var quizStore_1 = require("@/store/quizStore");
var userStore_1 = require("@/store/userStore");
var quizGenerator_1 = require("@/services/quizGenerator");
var networkService_1 = require("@/services/networkService");
var ContentValidator_1 = require("@/services/ContentValidator");
var QuizCard_1 = require("./QuizCard");
var QuizResultsScreen_1 = require("./QuizResultsScreen");
var SkeletonLoader_1 = require("./SkeletonLoader");
var NoConnectionScreen_1 = require("./NoConnectionScreen");
var vector_icons_1 = require("@expo/vector-icons");
var AdContainer_1 = require("./AdContainer");
var adConfig_1 = require("@/config/adConfig");
var SCREEN_HEIGHT = react_native_1.Dimensions.get('window').height;
var MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;
function QuizModal(_a) {
    var _this = this;
    var _b;
    var visible = _a.visible, onClose = _a.onClose, className = _a.className, subject = _a.subject, chapter = _a.chapter;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var ageGroup = (_b = (0, userStore_1.useUserStore)(function (s) { return s.ageGroup; })) !== null && _b !== void 0 ? _b : 'under12';
    var _c = (0, quizStore_1.useQuizStore)(), questions = _c.questions, isQuizActive = _c.isQuizActive, isLoading = _c.isLoading, error = _c.error, currentQuestionIndex = _c.currentQuestionIndex, resetQuiz = _c.resetQuiz, setQuestions = _c.setQuestions, setLoading = _c.setLoading, setError = _c.setError;
    var _d = (0, react_1.useState)(true), isConnected = _d[0], setIsConnected = _d[1];
    var slideAnim = (0, react_1.useState)(new react_native_1.Animated.Value(MODAL_HEIGHT))[0];
    (0, react_1.useEffect)(function () {
        if (visible) {
            react_native_1.Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            }).start();
        }
        else {
            react_native_1.Animated.timing(slideAnim, {
                toValue: MODAL_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);
    var handleLoadQuiz = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var connected, quizQuestions, safeQuestions, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, networkService_1.checkNetworkConnectivity)()];
                case 1:
                    connected = _a.sent();
                    setIsConnected(connected);
                    if (!connected)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 7]);
                    return [4 /*yield*/, (0, quizGenerator_1.generateQuizQuestions)(className, subject, chapter)];
                case 3:
                    quizQuestions = _a.sent();
                    return [4 /*yield*/, ContentValidator_1.ContentValidator.validateQuizQuestions(quizQuestions, {
                            contentId: "quiz:".concat(className, ":").concat(subject, ":").concat(chapter),
                            ageGroup: ageGroup,
                            source: 'QuizModal',
                        })];
                case 4:
                    safeQuestions = _a.sent();
                    if (safeQuestions.length === 0) {
                        throw new Error('Quiz content is unavailable right now.');
                    }
                    setQuestions(safeQuestions, chapter, subject, chapter);
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    // Failed to load quiz - handled by setError
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to load quiz');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [className, subject, chapter, ageGroup, setQuestions, setLoading, setError]);
    (0, react_1.useEffect)(function () {
        if (visible && questions.length === 0 && !error) {
            handleLoadQuiz();
        }
    }, [visible, questions.length, error, handleLoadQuiz]);
    var handleClose = (0, react_1.useCallback)(function () {
        react_native_1.Animated.timing(slideAnim, {
            toValue: MODAL_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(function () {
            resetQuiz();
            onClose();
        });
    }, [slideAnim, resetQuiz, onClose]);
    var handleRetry = (0, react_1.useCallback)(function () {
        setError(null);
        handleLoadQuiz();
    }, [handleLoadQuiz, setError]);
    var handleNext = (0, react_1.useCallback)(function () {
        var nextQuestion = quizStore_1.useQuizStore.getState().nextQuestion;
        nextQuestion();
    }, []);
    var handlePrevious = (0, react_1.useCallback)(function () {
        var previousQuestion = quizStore_1.useQuizStore.getState().previousQuestion;
        previousQuestion();
    }, []);
    var handleBackToLesson = (0, react_1.useCallback)(function () {
        handleClose();
    }, [handleClose]);
    var currentQuestion = questions[currentQuestionIndex];
    var styles = getStyles(colors);
    return (<react_native_1.Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <react_native_1.TouchableWithoutFeedback onPress={handleClose}>
        <react_native_1.View style={styles.overlay}>
          <react_native_1.TouchableWithoutFeedback>
            <react_native_1.Animated.View style={[
            styles.modalContainer,
            {
                transform: [{ translateY: slideAnim }],
            },
        ]}>
              {/* Header */}
              <react_native_1.View style={styles.header}>
                <react_native_1.View style={styles.headerContent}>
                  <react_native_1.View style={styles.chip}>
                    <vector_icons_1.Feather name="book-open" size={14} color="#FFFFFF"/>
                    <react_native_1.Text style={styles.chipText}>{subject}</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.chapterTitle}>{chapter}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
                  <vector_icons_1.Feather name="x" size={24} color={colors.textSecondary}/>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>

              {/* Content */}
              <react_native_1.View style={styles.content}>
                {!isConnected ? (<NoConnectionScreen_1.default onRetry={handleRetry} message="Check your internet connection to load quiz questions."/>) : isLoading ? (<react_native_1.View style={styles.loadingContainer}>
                    <SkeletonLoader_1.QuestionSkeleton />
                    <SkeletonLoader_1.QuestionSkeleton />
                    <SkeletonLoader_1.QuestionSkeleton />
                  </react_native_1.View>) : error ? (<react_native_1.View style={styles.errorContainer}>
                    <vector_icons_1.Feather name="alert-triangle" size={48} color={colors.error}/>
                    <react_native_1.Text style={styles.errorTitle}>Unable to Load Quiz</react_native_1.Text>
                    <react_native_1.Text style={styles.errorMessage}>{error}</react_native_1.Text>
                    <react_native_1.TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
                      <vector_icons_1.Feather name="refresh-cw" size={20} color="#FFFFFF"/>
                      <react_native_1.Text style={styles.retryButtonText}>Try Again</react_native_1.Text>
                    </react_native_1.TouchableOpacity>
                  </react_native_1.View>) : questions.length > 0 && isQuizActive && currentQuestion ? (<QuizCard_1.default question={currentQuestion} questionNumber={currentQuestionIndex + 1} totalQuestions={questions.length} onNext={handleNext} onPrevious={handlePrevious}/>) : questions.length > 0 && !isQuizActive ? (<>
                    <QuizResultsScreen_1.default onRetry={handleRetry} onBackToLesson={handleBackToLesson}/>
                    <AdContainer_1.default unitId={adConfig_1.AD_UNIT_IDS.BANNER_QUIZ}/>
                  </>) : null}
              </react_native_1.View>
            </react_native_1.Animated.View>
          </react_native_1.TouchableWithoutFeedback>
        </react_native_1.View>
      </react_native_1.TouchableWithoutFeedback>
    </react_native_1.Modal>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContainer: {
            height: MODAL_HEIGHT,
            backgroundColor: colors.background,
            borderTopLeftRadius: theme_1.BorderRadius.xl,
            borderTopRightRadius: theme_1.BorderRadius.xl,
            overflow: 'hidden',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 10,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: theme_1.Spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
        },
        headerContent: {
            flex: 1,
        },
        chip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: 20,
            alignSelf: 'flex-start',
            marginBottom: theme_1.Spacing.sm,
        },
        chipText: {
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            marginLeft: 4,
        },
        chapterTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
        },
        closeButton: {
            padding: theme_1.Spacing.sm,
            marginTop: -theme_1.Spacing.sm,
            marginRight: -theme_1.Spacing.sm,
        },
        content: {
            flex: 1,
            padding: theme_1.Spacing.lg,
        },
        loadingContainer: {
            flex: 1,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.xl,
        },
        errorTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
            marginTop: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.sm,
        },
        errorMessage: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.xl,
        },
        retryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            paddingVertical: theme_1.Spacing.md,
            paddingHorizontal: theme_1.Spacing.xl,
            borderRadius: theme_1.BorderRadius.lg,
            minWidth: 160,
            minHeight: 56,
        },
        retryButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            marginLeft: 8,
        },
    });
};
