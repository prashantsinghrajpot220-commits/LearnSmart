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
exports.default = PomodoroTimer;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var TimerService_1 = require("@/services/TimerService");
var vector_icons_1 = require("@expo/vector-icons");
function PomodoroTimer(_a) {
    var _this = this;
    var visible = _a.visible, onClose = _a.onClose, subject = _a.subject, chapter = _a.chapter, onSessionStart = _a.onSessionStart, onSessionComplete = _a.onSessionComplete;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _b = (0, react_1.useState)({
        studyDuration: 25,
        breakDuration: 5,
        soundEnabled: true,
        hapticEnabled: true,
        autoStartBreak: false,
        autoStartStudy: false,
    }), settings = _b[0], setSettings = _b[1];
    var _c = (0, react_1.useState)(null), activeState = _c[0], setActiveState = _c[1];
    var _d = (0, react_1.useState)(false), showSettings = _d[0], setShowSettings = _d[1];
    var _e = (0, react_1.useState)(25), selectedDuration = _e[0], setSelectedDuration = _e[1];
    var loadSettings = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var loadedSettings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.loadSettings()];
                case 1:
                    loadedSettings = _a.sent();
                    setSettings(loadedSettings);
                    setSelectedDuration(loadedSettings.studyDuration);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var loadActiveTimer = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.loadActiveState()];
                case 1:
                    state = _a.sent();
                    setActiveState(state);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            loadSettings();
            loadActiveTimer();
        }, 0);
        return function () { return clearTimeout(timer); };
    }, [loadSettings, loadActiveTimer]);
    var handleTimerComplete = (0, react_1.useCallback)(function (state) { return __awaiter(_this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.getSession(state.sessionId)];
                case 1:
                    session = _a.sent();
                    if (session && state.phase === 'study') {
                        // Session completed, transition to break
                        // In a real app, you might trigger a notification here
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        var unsubscribe = TimerService_1.timerService.subscribe(function (state) {
            setActiveState(state);
            // Check if timer completed
            if (state && state.remainingTime <= 0) {
                handleTimerComplete(state);
            }
        });
        return function () {
            unsubscribe();
        };
    }, [handleTimerComplete]);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
    };
    var getProgress = function () {
        if (!activeState)
            return 0;
        return ((activeState.totalDuration - activeState.remainingTime) / activeState.totalDuration) * 100;
    };
    var handleStart = function () { return __awaiter(_this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.startStudySession(selectedDuration, settings.breakDuration, subject, chapter)];
                case 1:
                    sessionId = _a.sent();
                    if (onSessionStart) {
                        onSessionStart(sessionId);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePause = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.pauseSession()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleResume = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.resumeSession()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.resetSession()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleStartBreak = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!activeState)
                        return [2 /*return*/];
                    return [4 /*yield*/, TimerService_1.timerService.startBreakSession(settings.breakDuration)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDurationChange = function (duration) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedDuration(duration);
                    return [4 /*yield*/, TimerService_1.timerService.saveSettings({ studyDuration: duration })];
                case 1:
                    _a.sent();
                    setSettings(function (prev) { return (__assign(__assign({}, prev), { studyDuration: duration })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var handleBreakDurationChange = function (duration) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TimerService_1.timerService.saveSettings({ breakDuration: duration })];
                case 1:
                    _a.sent();
                    setSettings(function (prev) { return (__assign(__assign({}, prev), { breakDuration: duration })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var getPhaseText = function () {
        if (!activeState)
            return 'Ready to Focus';
        if (activeState.phase === 'study')
            return 'Study Phase';
        if (activeState.phase === 'break')
            return 'Break Time';
        return 'Paused';
    };
    var isRunning = activeState && activeState.phase !== 'paused';
    var styles = getStyles(colors);
    return (<react_native_1.Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.header}>
          <react_native_1.TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <vector_icons_1.Feather name="x" size={24} color={colors.text}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.headerTitle}>Pomodoro Timer</react_native_1.Text>
          <react_native_1.View style={styles.headerSpacer}/>
        </react_native_1.View>

        {!activeState ? (<SetupView colors={colors} selectedDuration={selectedDuration} onDurationChange={handleDurationChange} onStart={handleStart} subject={subject} chapter={chapter}/>) : activeState.phase === 'break' ? (<BreakTimerView colors={colors} activeState={activeState} settings={settings} onDurationChange={handleBreakDurationChange} onResume={handleResume} onPause={handlePause} onReset={handleReset} onEndBreak={handleStart}/>) : (<StudyTimerView colors={colors} activeState={activeState} settings={settings} onDurationChange={handleDurationChange} onStart={handleStart} onPause={handlePause} onResume={handleResume} onReset={handleReset}/>)}
      </react_native_1.View>
    </react_native_1.Modal>);
}
function SetupView(_a) {
    var colors = _a.colors, selectedDuration = _a.selectedDuration, onDurationChange = _a.onDurationChange, onStart = _a.onStart, subject = _a.subject, chapter = _a.chapter;
    var styles = getStyles(colors);
    var durations = [15, 25, 30, 45, 60];
    return (<react_native_1.View style={styles.content}>
      {(subject || chapter) && (<react_native_1.View style={styles.contextContainer}>
          <react_native_1.Text style={styles.contextText}>
            {subject && "\uD83D\uDCDA ".concat(subject)}
            {subject && chapter && ' • '}
            {chapter && "\uD83D\uDCD6 ".concat(chapter)}
          </react_native_1.Text>
        </react_native_1.View>)}

      <react_native_1.Text style={styles.phaseTitle}>Ready to Focus?</react_native_1.Text>
      <react_native_1.Text style={styles.phaseSubtitle}>Choose your study duration</react_native_1.Text>

      <react_native_1.View style={styles.durationContainer}>
        {durations.map(function (duration) { return (<react_native_1.TouchableOpacity key={duration} style={[
                styles.durationButton,
                selectedDuration === duration && styles.durationButtonActive,
            ]} onPress={function () { return onDurationChange(duration); }} activeOpacity={0.8}>
            <react_native_1.Text style={[
                styles.durationButtonText,
                selectedDuration === duration && styles.durationButtonTextActive,
            ]}>
              {duration} min
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>); })}
      </react_native_1.View>

      <react_native_1.TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
        <vector_icons_1.Feather name="play" size={24} color="#FFFFFF"/>
        <react_native_1.Text style={styles.startButtonText}>Start Study Session</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
function StudyTimerView(_a) {
    var colors = _a.colors, activeState = _a.activeState, settings = _a.settings, onDurationChange = _a.onDurationChange, onStart = _a.onStart, onPause = _a.onPause, onResume = _a.onResume, onReset = _a.onReset;
    var styles = getStyles(colors);
    var _b = (0, react_1.useState)(false), showDurationSelector = _b[0], setShowDurationSelector = _b[1];
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
    };
    var isPaused = activeState.phase === 'paused';
    return (<react_native_1.View style={styles.content}>
      <react_native_1.Text style={styles.phaseTitle}>Study Phase</react_native_1.Text>
      <react_native_1.Text style={styles.phaseSubtitle}>Stay focused and grow your tree!</react_native_1.Text>

      <react_native_1.View style={styles.timerContainer}>
        <react_native_1.View style={[styles.timerRing, { borderColor: colors.primary }]}>
          <react_native_1.Text style={[styles.timerText, { color: colors.primary }]}>
            {formatTime(activeState.remainingTime)}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.controlsContainer}>
        <react_native_1.TouchableOpacity style={[styles.controlButton, styles.secondaryButton]} onPress={onReset} activeOpacity={0.8}>
          <vector_icons_1.Feather name="rotate-ccw" size={20} color={colors.text}/>
          <react_native_1.Text style={[styles.controlButtonText, { color: colors.text }]}>Reset</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity style={[styles.controlButton, styles.primaryButton, { backgroundColor: colors.primary }]} onPress={isPaused ? onResume : onPause} activeOpacity={0.8}>
          <vector_icons_1.Feather name={isPaused ? 'play' : 'pause'} size={24} color="#FFFFFF"/>
          <react_native_1.Text style={styles.controlButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {!showDurationSelector && (<react_native_1.TouchableOpacity style={styles.changeDurationButton} onPress={function () { return setShowDurationSelector(true); }} activeOpacity={0.8}>
          <react_native_1.Text style={styles.changeDurationText}>Change duration</react_native_1.Text>
        </react_native_1.TouchableOpacity>)}

      {showDurationSelector && (<react_native_1.View style={styles.durationSelector}>
          {[15, 25, 30, 45, 60].map(function (duration) { return (<react_native_1.TouchableOpacity key={duration} style={[
                    styles.durationOption,
                    settings.studyDuration === duration && styles.durationOptionActive,
                ]} onPress={function () {
                    onDurationChange(duration);
                    setShowDurationSelector(false);
                }} activeOpacity={0.8}>
              <react_native_1.Text style={[
                    styles.durationOptionText,
                    settings.studyDuration === duration && styles.durationOptionTextActive,
                ]}>
                {duration} min
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.View>)}
    </react_native_1.View>);
}
function BreakTimerView(_a) {
    var colors = _a.colors, activeState = _a.activeState, settings = _a.settings, onDurationChange = _a.onDurationChange, onResume = _a.onResume, onPause = _a.onPause, onReset = _a.onReset, onEndBreak = _a.onEndBreak;
    var styles = getStyles(colors);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
    };
    var isPaused = activeState.phase === 'paused';
    return (<react_native_1.View style={styles.content}>
      <react_native_1.Text style={styles.phaseTitle}>Break Time!</react_native_1.Text>
      <react_native_1.Text style={styles.phaseSubtitle}>Take a well-deserved break</react_native_1.Text>

      <react_native_1.View style={styles.timerContainer}>
        <react_native_1.View style={[styles.timerRing, { borderColor: colors.warning }]}>
          <react_native_1.Text style={[styles.timerText, { color: colors.warning }]}>
            {formatTime(activeState.remainingTime)}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.controlsContainer}>
        <react_native_1.TouchableOpacity style={[styles.controlButton, styles.secondaryButton]} onPress={onReset} activeOpacity={0.8}>
          <vector_icons_1.Feather name="rotate-ccw" size={20} color={colors.text}/>
          <react_native_1.Text style={[styles.controlButtonText, { color: colors.text }]}>End</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity style={[styles.controlButton, styles.primaryButton, { backgroundColor: colors.primary }]} onPress={isPaused ? onResume : onPause} activeOpacity={0.8}>
          <vector_icons_1.Feather name={isPaused ? 'play' : 'pause'} size={24} color="#FFFFFF"/>
          <react_native_1.Text style={styles.controlButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      <react_native_1.TouchableOpacity style={styles.endBreakButton} onPress={onEndBreak} activeOpacity={0.8}>
        <vector_icons_1.Feather name="arrow-right" size={20} color={colors.primary}/>
        <react_native_1.Text style={styles.endBreakButtonText}>Start New Study Session</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: react_native_1.Platform.select({ ios: 50, default: 20 }),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.md,
        },
        headerTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        closeButton: {
            padding: theme_1.Spacing.sm,
        },
        headerSpacer: {
            width: 40,
        },
        content: {
            flex: 1,
            paddingHorizontal: theme_1.Spacing.xl,
            paddingTop: theme_1.Spacing.xl,
        },
        contextContainer: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            marginBottom: theme_1.Spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
        },
        contextText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        phaseTitle: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        phaseSubtitle: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.xxl,
        },
        durationContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme_1.Spacing.md,
            marginBottom: theme_1.Spacing.xxl,
        },
        durationButton: {
            backgroundColor: colors.cardBackground,
            paddingHorizontal: theme_1.Spacing.xl,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            borderWidth: 2,
            borderColor: colors.border,
        },
        durationButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        durationButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
        },
        durationButtonTextActive: {
            color: colors.white,
        },
        timerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: theme_1.Spacing.xxl,
        },
        timerRing: {
            width: 250,
            height: 250,
            borderRadius: 125,
            borderWidth: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.cardBackground,
        },
        timerText: {
            fontSize: 48,
            fontWeight: theme_1.FontWeights.bold,
        },
        controlsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.xl,
        },
        controlButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.xl,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.xl,
            gap: theme_1.Spacing.sm,
        },
        secondaryButton: {
            backgroundColor: colors.cardBackground,
            borderWidth: 2,
            borderColor: colors.border,
        },
        primaryButton: {
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        controlButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
        },
        changeDurationButton: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.md,
        },
        changeDurationText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textDecorationLine: 'underline',
        },
        durationSelector: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme_1.Spacing.sm,
            marginTop: theme_1.Spacing.md,
        },
        durationOption: {
            paddingHorizontal: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
        },
        durationOptionActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        durationOptionText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.text,
        },
        durationOptionTextActive: {
            color: colors.white,
        },
        startButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            paddingHorizontal: theme_1.Spacing.xxl,
            paddingVertical: theme_1.Spacing.lg,
            borderRadius: theme_1.BorderRadius.xl,
            gap: theme_1.Spacing.md,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
        startButtonText: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.white,
        },
        endBreakButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.cardBackground,
            paddingHorizontal: theme_1.Spacing.xl,
            paddingVertical: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.xl,
            gap: theme_1.Spacing.sm,
            borderWidth: 2,
            borderColor: colors.primary,
        },
        endBreakButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.primary,
        },
    });
};
