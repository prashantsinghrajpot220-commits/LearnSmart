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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LessonView;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var ContentValidator_1 = require("@/services/ContentValidator");
var content_1 = require("@/types/content");
var AdContainer_1 = require("./AdContainer");
var PomodoroTimer_1 = require("./PomodoroTimer");
var VirtualForest_1 = require("./VirtualForest");
var TimerService_1 = require("@/services/TimerService");
var FocusTracker_1 = require("@/services/FocusTracker");
var LessonImage_1 = require("./LessonImage");
var LabeledDiagram_1 = require("./LabeledDiagram");
function LessonView(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f;
    var chapter = _a.chapter, subject = _a.subject, lessonContent = _a.lessonContent, currentLessonIndex = _a.currentLessonIndex, totalLessons = _a.totalLessons, onNext = _a.onNext, onPrevious = _a.onPrevious, _g = _a.showNavigation, showNavigation = _g === void 0 ? true : _g;
    var router = (0, expo_router_1.useRouter)();
    var _h = (0, ThemeContext_1.useTheme)(), colors = _h.colors, isDark = _h.isDark;
    var ageGroup = (_b = (0, userStore_1.useUserStore)(function (s) { return s.ageGroup; })) !== null && _b !== void 0 ? _b : 'under12';
    var scrollViewRef = (0, react_1.useRef)(null);
    var contentId = (0, react_1.useMemo)(function () { return "lesson:".concat(subject, ":").concat(chapter, ":").concat(lessonContent.title); }, [subject, chapter, lessonContent.title]);
    var syncValidated = (0, react_1.useMemo)(function () {
        return ContentValidator_1.ContentValidator.validateLessonContentSync(lessonContent, {
            contentId: contentId,
            ageGroup: ageGroup,
            source: 'LessonView',
        });
    }, [lessonContent, contentId, ageGroup]);
    var _j = (0, react_1.useState)(false), isQuarantined = _j[0], setIsQuarantined = _j[1];
    var _k = (0, react_1.useState)(null), contentBlockedMessage = _k[0], setContentBlockedMessage = _k[1];
    var _l = (0, react_1.useState)(false), showTimer = _l[0], setShowTimer = _l[1];
    var _m = (0, react_1.useState)(false), showForest = _m[0], setShowForest = _m[1];
    var _o = (0, react_1.useState)(null), activeSessionId = _o[0], setActiveSessionId = _o[1];
    var _p = (0, react_1.useState)(false), showBreakActivity = _p[0], setShowBreakActivity = _p[1];
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        var run = function () { return __awaiter(_this, void 0, void 0, function () {
            var combinedText, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsQuarantined(false);
                        setContentBlockedMessage(null);
                        combinedText = __spreadArray(__spreadArray([
                            lessonContent.title
                        ], (lessonContent.bulletPoints || []), true), (lessonContent.paragraphs || []), true).join('\n');
                        return [4 /*yield*/, ContentValidator_1.ContentValidator.validateText({
                                text: combinedText,
                                context: {
                                    contentId: contentId,
                                    contentType: content_1.ContentType.Lesson,
                                    ageGroup: ageGroup,
                                    source: 'LessonView',
                                },
                            })];
                    case 1:
                        result = (_b.sent()).result;
                        if (cancelled)
                            return [2 /*return*/];
                        if (result.decision === 'quarantine' || result.decision === 'block') {
                            setIsQuarantined(true);
                            setContentBlockedMessage((_a = result.fallbackText) !== null && _a !== void 0 ? _a : 'This lesson is temporarily unavailable.');
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        run().catch(function (err) {
            console.warn('Lesson safety check failed:', err);
        });
        return function () {
            cancelled = true;
        };
    }, [lessonContent, contentId, ageGroup]);
    // Load active timer and forest states
    (0, react_1.useEffect)(function () {
        var loadStates = function () { return __awaiter(_this, void 0, void 0, function () {
            var activeState, activeTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TimerService_1.timerService.loadActiveState()];
                    case 1:
                        activeState = _a.sent();
                        if (!activeState) return [3 /*break*/, 3];
                        setActiveSessionId(activeState.sessionId);
                        return [4 /*yield*/, FocusTracker_1.focusTracker.loadActiveTree()];
                    case 2:
                        activeTree = _a.sent();
                        if (activeTree) {
                            setShowForest(true);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadStates();
    }, []);
    var handleStartTimer = (0, react_1.useCallback)(function () {
        setShowTimer(true);
    }, []);
    var handleTimerClose = (0, react_1.useCallback)(function () {
        setShowTimer(false);
    }, []);
    var handleSessionStart = (0, react_1.useCallback)(function (sessionId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setActiveSessionId(sessionId);
                    return [4 /*yield*/, FocusTracker_1.focusTracker.startGrowingTree(sessionId)];
                case 1:
                    _a.sent();
                    setShowForest(true);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleSessionComplete = (0, react_1.useCallback)(function (sessionId, focusScore) { return __awaiter(_this, void 0, void 0, function () {
        var treeSurvived;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.updateFocusScore(sessionId, focusScore)];
                case 1:
                    _a.sent();
                    treeSurvived = FocusTracker_1.focusTracker.isTreeAlive();
                    return [4 /*yield*/, TimerService_1.timerService.markTreeSurvived(sessionId, treeSurvived)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, FocusTracker_1.focusTracker.stopGrowingTree()];
                case 3:
                    _a.sent();
                    setActiveSessionId(null);
                    setShowForest(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleBreakActivitySelect = (0, react_1.useCallback)(function (activity) {
        setShowBreakActivity(false);
    }, []);
    var handleBack = function () {
        router.back();
    };
    var hasPrevious = currentLessonIndex > 0;
    var hasNext = currentLessonIndex < totalLessons - 1;
    var styles = getStyles(colors, isDark);
    var isOriginalEmpty = ((_d = (_c = lessonContent.paragraphs) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) === 0 && ((_f = (_e = lessonContent.bulletPoints) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) === 0;
    var displayLessonContent = isQuarantined ? null : syncValidated.content;
    var emptyMessage = contentBlockedMessage !== null && contentBlockedMessage !== void 0 ? contentBlockedMessage : (!isOriginalEmpty && syncValidated.decision === 'filter'
        ? 'This lesson is not available for your age group.'
        : 'Lesson content coming soon');
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.headerTop}>
          <react_native_1.TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <react_native_1.Text style={styles.backButtonText}>←</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.View style={styles.chapterBadge}>
            <react_native_1.Text style={styles.chapterBadgeText}>
              {subject} • {chapter}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
        
        {/* Pomodoro Timer Button */}
        {!activeSessionId && (<react_native_1.TouchableOpacity style={styles.timerButton} onPress={handleStartTimer} activeOpacity={0.8}>
            <react_native_1.Text style={styles.timerButtonText}>⏱️</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      {/* Virtual Forest - shown when timer is active */}
      {showForest && activeSessionId && (<VirtualForest_1.default sessionId={activeSessionId} showHistory={false}/>)}

      <react_native_1.ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true} alwaysBounceVertical={true}>
        <react_native_1.View style={styles.lessonCard}>
          <react_native_1.View style={styles.iconContainer}>
            <react_native_1.Text style={styles.icon}>{(displayLessonContent === null || displayLessonContent === void 0 ? void 0 : displayLessonContent.icon) || '📖'}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.Text style={styles.lessonTitle}>{(displayLessonContent === null || displayLessonContent === void 0 ? void 0 : displayLessonContent.title) || lessonContent.title}</react_native_1.Text>

          <react_native_1.View style={styles.divider}/>

          {displayLessonContent ? (<>
              {displayLessonContent.imageUrl && (<LessonImage_1.LessonImage url={displayLessonContent.imageUrl} altText={displayLessonContent.title} animationType="slide"/>)}

              <react_native_1.View style={styles.contentSection}>
                {displayLessonContent.bulletPoints.map(function (point, index) { return (<react_native_1.View key={index} style={styles.bulletPointContainer}>
                    <react_native_1.Text style={styles.bulletPoint}>•</react_native_1.Text>
                    <react_native_1.Text style={styles.bulletPointText}>{point}</react_native_1.Text>
                  </react_native_1.View>); })}
              </react_native_1.View>

              {displayLessonContent.diagramData && (<LabeledDiagram_1.LabeledDiagram data={displayLessonContent.diagramData}/>)}

              {displayLessonContent.paragraphs.map(function (paragraph, index) { return (<react_native_1.View key={"para-".concat(index)} style={styles.paragraphContainer}>
                  <react_native_1.Text style={styles.paragraphText}>{paragraph}</react_native_1.Text>
                </react_native_1.View>); })}

              {displayLessonContent.paragraphs.length === 0 && displayLessonContent.bulletPoints.length === 0 && (<react_native_1.View style={styles.emptyContent}>
                  <react_native_1.Text style={styles.emptyText}>{emptyMessage}</react_native_1.Text>
                </react_native_1.View>)}
            </>) : (<react_native_1.View style={styles.emptyContent}>
              <react_native_1.Text style={styles.emptyText}>{emptyMessage}</react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>

        {/* Advertisement Banner */}
        <AdContainer_1.default />

        {showNavigation && (<react_native_1.View style={styles.navigationSpacer}/>)}
      </react_native_1.ScrollView>

      {showNavigation && (<react_native_1.View style={styles.navigationContainer}>
          <react_native_1.View style={styles.navigationRow}>
            <react_native_1.TouchableOpacity style={[
                styles.navButton,
                styles.prevButton,
                !hasPrevious && styles.navButtonDisabled,
            ]} onPress={onPrevious} disabled={!hasPrevious} activeOpacity={hasPrevious ? 0.7 : 1}>
              <react_native_1.Text style={[
                styles.navButtonText,
                styles.prevButtonText,
                !hasPrevious && styles.navButtonTextDisabled,
            ]}>
                ← Previous
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>

            <react_native_1.View style={styles.lessonIndicator}>
              <react_native_1.Text style={styles.lessonIndicatorText}>
                {currentLessonIndex + 1} / {totalLessons}
              </react_native_1.Text>
            </react_native_1.View>

            <react_native_1.TouchableOpacity style={[
                styles.navButton,
                styles.nextButton,
                !hasNext && styles.navButtonDisabled,
            ]} onPress={onNext} disabled={!hasNext} activeOpacity={hasNext ? 0.7 : 1}>
              <react_native_1.Text style={[
                styles.navButtonText,
                styles.nextButtonText,
                !hasNext && styles.navButtonTextDisabled,
            ]}>
                Next →
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>)}

      {/* Pomodoro Timer Modal */}
      <PomodoroTimer_1.default visible={showTimer} onClose={handleTimerClose} subject={subject} chapter={chapter} onSessionStart={handleSessionStart} onSessionComplete={handleSessionComplete}/>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingTop: react_native_1.Platform.select({ ios: 110, default: 70 }), // Adjust for global header
        paddingBottom: theme_1.Spacing.md,
        backgroundColor: colors.background,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: theme_1.Spacing.sm,
        marginRight: theme_1.Spacing.sm,
    },
    backButtonText: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.primary,
        fontWeight: theme_1.FontWeights.semibold,
    },
    chapterBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.xl,
    },
    chapterBadgeText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.white,
    },
    timerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    timerButtonText: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingTop: theme_1.Spacing.md,
        paddingBottom: theme_1.Spacing.xl,
    },
    lessonCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xl,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.Spacing.lg,
    },
    icon: {
        fontSize: 64,
    },
    lessonTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: isDark ? colors.text : colors.charcoal,
        textAlign: 'center',
        marginBottom: theme_1.Spacing.lg,
    },
    divider: {
        height: 2,
        backgroundColor: colors.primary,
        borderRadius: 1,
        marginBottom: theme_1.Spacing.xl,
        width: 60,
        alignSelf: 'center',
    },
    contentSection: {
        marginBottom: theme_1.Spacing.lg,
    },
    bulletPointContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme_1.Spacing.md,
        paddingLeft: theme_1.Spacing.sm,
    },
    bulletPoint: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.primary,
        marginRight: theme_1.Spacing.sm,
        lineHeight: theme_1.FontSizes.lg * 1.4,
    },
    bulletPointText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
        flex: 1,
        lineHeight: theme_1.FontSizes.md * 1.5,
    },
    paragraphContainer: {
        marginBottom: theme_1.Spacing.md,
    },
    paragraphText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
        lineHeight: theme_1.FontSizes.md * 1.6,
        textAlign: 'justify',
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: theme_1.Spacing.xl,
    },
    emptyText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    navigationSpacer: {
        height: theme_1.Spacing.xl,
    },
    navigationContainer: {
        backgroundColor: colors.background,
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    navigationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navButton: {
        paddingVertical: theme_1.Spacing.md,
        paddingHorizontal: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    prevButton: {
        backgroundColor: colors.cardBackground,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    nextButton: {
        backgroundColor: colors.primary,
    },
    navButtonDisabled: {
        backgroundColor: colors.cardBackground,
        borderColor: colors.lightGray,
        opacity: 0.6,
    },
    navButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
    },
    prevButtonText: {
        color: colors.primary,
    },
    nextButtonText: {
        color: colors.white,
    },
    navButtonTextDisabled: {
        color: colors.textSecondary,
    },
    lessonIndicator: {
        paddingHorizontal: theme_1.Spacing.md,
    },
    lessonIndicatorText: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        fontWeight: theme_1.FontWeights.medium,
    },
}); };
