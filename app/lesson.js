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
exports.default = Lesson;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var LessonView_1 = require("@/components/LessonView");
var curriculum_1 = require("@/constants/curriculum");
var ThemeContext_1 = require("@/components/ThemeContext");
var ChatContext_1 = require("@/context/ChatContext");
var QuizModal_1 = require("@/components/QuizModal");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var vector_icons_1 = require("@expo/vector-icons");
var xpStore_1 = require("@/store/xpStore");
var achievementStore_1 = require("@/store/achievementStore");
var CoinRewardService_1 = require("@/services/CoinRewardService");
var streakService_1 = require("@/services/streakService");
function Lesson() {
    var _this = this;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, expo_router_1.useLocalSearchParams)(), chapter = _a.chapter, subject = _a.subject, className = _a.class, lesson = _a.lesson;
    var setCurrentContext = (0, ChatContext_1.useSmartyContext)().setCurrentContext;
    var _b = (0, xpStore_1.useXPStore)(), addXP = _b.addXP, incrementLessonsRead = _b.incrementLessonsRead;
    var checkAndUnlock = (0, achievementStore_1.useAchievementStore)().checkAndUnlock;
    var _c = (0, react_1.useState)([]), lessons = _c[0], setLessons = _c[1];
    var _d = (0, react_1.useState)(0), currentLessonIndex = _d[0], setCurrentLessonIndex = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(false), quizModalVisible = _f[0], setQuizModalVisible = _f[1];
    var _g = (0, react_1.useState)(false), hasAwardedXP = _g[0], setHasAwardedXP = _g[1];
    var loadLessons = (0, react_1.useCallback)(function () {
        setLoading(true);
        var allLessons = (0, curriculum_1.getChapterLessons)(className, subject, chapter);
        setLessons(allLessons);
        if (lesson) {
            var index = allLessons.findIndex(function (l) { return l.title === lesson; });
            setCurrentLessonIndex(index >= 0 ? index : 0);
        }
        else {
            setCurrentLessonIndex(0);
        }
        setLoading(false);
        setHasAwardedXP(false);
    }, [chapter, className, lesson, subject]);
    (0, react_1.useEffect)(function () {
        if (chapter && subject && className) {
            var timer_1 = setTimeout(function () {
                loadLessons();
                setCurrentContext(subject, chapter, lesson);
            }, 0);
            return function () { return clearTimeout(timer_1); };
        }
    }, [chapter, subject, className, loadLessons, lesson, setCurrentContext]);
    // Award XP when lesson is displayed
    (0, react_1.useEffect)(function () {
        if (lessons.length > 0 && !hasAwardedXP) {
            var awardRewards = function () { return __awaiter(_this, void 0, void 0, function () {
                var streakResult, _a, totalLessonsRead, getXP;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // Award 10 XP for reading a lesson
                        return [4 /*yield*/, addXP(10)];
                        case 1:
                            // Award 10 XP for reading a lesson
                            _b.sent();
                            incrementLessonsRead();
                            // Award SmartCoins for lesson completion
                            return [4 /*yield*/, CoinRewardService_1.coinRewardService.rewardLessonCompletion()];
                        case 2:
                            // Award SmartCoins for lesson completion
                            _b.sent();
                            return [4 /*yield*/, streakService_1.streakService.checkAndUpdateStreak()];
                        case 3:
                            streakResult = _b.sent();
                            if (!(streakResult.streakChanged && CoinRewardService_1.coinRewardService.shouldReceiveStreakBonus(streakResult.streak))) return [3 /*break*/, 5];
                            return [4 /*yield*/, CoinRewardService_1.coinRewardService.rewardStreakMilestone(streakResult.streak)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            setHasAwardedXP(true);
                            _a = xpStore_1.useXPStore.getState(), totalLessonsRead = _a.totalLessonsRead, getXP = _a.getXP;
                            checkAndUnlock({
                                currentStreak: streakResult.streak,
                                totalQuizzesCompleted: 0,
                                totalLessonsRead: totalLessonsRead,
                                currentXP: getXP(),
                                rank: xpStore_1.useXPStore.getState().getRank().name,
                            });
                            return [2 /*return*/];
                    }
                });
            }); };
            awardRewards();
        }
    }, [lessons.length, hasAwardedXP, addXP, incrementLessonsRead, checkAndUnlock]);
    var handleNext = function () {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setHasAwardedXP(false); // Reset XP flag for new lesson
        }
    };
    var handlePrevious = function () {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
            setHasAwardedXP(false); // Reset XP flag for previous lesson
        }
    };
    var handleTestYourself = (0, react_1.useCallback)(function () {
        setQuizModalVisible(true);
    }, []);
    var handleCloseQuiz = (0, react_1.useCallback)(function () {
        setQuizModalVisible(false);
    }, []);
    var styles = getStyles(colors);
    if (loading) {
        return (<react_native_1.View style={styles.loadingContainer}>
        <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        <react_native_1.Text style={styles.loadingText}>Loading lesson...</react_native_1.Text>
      </react_native_1.View>);
    }
    if (lessons.length === 0) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={styles.title}>{chapter}</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>{subject}</react_native_1.Text>
          <react_native_1.View style={styles.placeholderContainer}>
            <react_native_1.Text style={styles.placeholderText}>No lesson content available</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>);
    }
    var currentLesson = lessons[currentLessonIndex];
    return (<ErrorBoundary_1.default>
      <react_native_1.View style={styles.container}>
        <LessonView_1.default chapter={chapter} subject={subject} className={className} lessonContent={currentLesson} currentLessonIndex={currentLessonIndex} totalLessons={lessons.length} onNext={handleNext} onPrevious={handlePrevious} showNavigation={lessons.length > 1}/>
        
        {/* XP Notification Banner */}
        {hasAwardedXP && (<react_native_1.View style={styles.xpBanner}>
            <vector_icons_1.Feather name="plus-circle" size={16} color="#FFFFFF"/>
            <react_native_1.Text style={styles.xpBannerText}>+10 XP earned!</react_native_1.Text>
          </react_native_1.View>)}
        
        {/* Test Yourself Button */}
        <react_native_1.View style={styles.testButtonContainer}>
          <react_native_1.TouchableOpacity style={styles.testButton} onPress={handleTestYourself} activeOpacity={0.8}>
            <react_native_1.View style={styles.testButtonIcon}>
              <vector_icons_1.Feather name="zap" size={24} color="#FFFFFF"/>
            </react_native_1.View>
            <react_native_1.View style={styles.testButtonContent}>
              <react_native_1.Text style={styles.testButtonTitle}>Test Yourself</react_native_1.Text>
              <react_native_1.Text style={styles.testButtonSubtitle}>Take a quick quiz on this chapter</react_native_1.Text>
            </react_native_1.View>
            <vector_icons_1.Feather name="chevron-right" size={24} color={colors.primary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* Quiz Modal */}
        <QuizModal_1.default visible={quizModalVisible} onClose={handleCloseQuiz} className={className} subject={subject} chapter={chapter}/>
      </react_native_1.View>
    </ErrorBoundary_1.default>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        marginTop: theme_1.Spacing.md,
    },
    content: {
        paddingHorizontal: theme_1.Spacing.xl,
        paddingTop: react_native_1.Platform.select({ ios: 110, default: 70 }),
        paddingBottom: theme_1.Spacing.xxl + 80,
    },
    title: {
        fontSize: 32,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: theme_1.Spacing.xxl,
    },
    placeholderContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: 32,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    placeholderText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    xpBanner: {
        position: 'absolute',
        top: react_native_1.Platform.select({ web: 80, default: 100 }),
        left: '50%',
        transform: [{ translateX: -75 }],
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.xl,
        zIndex: 100,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    xpBannerText: {
        color: '#FFFFFF',
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.semibold,
        marginLeft: theme_1.Spacing.xs,
    },
    testButtonContainer: {
        position: 'absolute',
        bottom: theme_1.Spacing.xxl,
        left: theme_1.Spacing.lg,
        right: theme_1.Spacing.lg,
        zIndex: 10,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.xl,
        padding: theme_1.Spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    testButtonIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    testButtonContent: {
        flex: 1,
    },
    testButtonTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: 2,
    },
    testButtonSubtitle: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
}); };
