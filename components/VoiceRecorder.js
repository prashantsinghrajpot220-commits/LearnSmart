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
exports.default = VoiceRecorder;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
var SpeechToTextService_1 = require("@/services/SpeechToTextService");
var NoteSummarizerService_1 = require("@/services/NoteSummarizerService");
var screenWidth = react_native_1.Dimensions.get('window').width;
function VoiceRecorder(_a) {
    var _this = this;
    var onTranscriptionComplete = _a.onTranscriptionComplete, _b = _a.language, language = _b === void 0 ? 'en' : _b, subject = _a.subject, chapter = _a.chapter;
    var _c = (0, ThemeContext_1.useTheme)(), colors = _c.colors, isDark = _c.isDark;
    var _d = (0, react_1.useState)(false), isRecording = _d[0], setIsRecording = _d[1];
    var _e = (0, react_1.useState)(false), isProcessing = _e[0], setIsProcessing = _e[1];
    var _f = (0, react_1.useState)(''), transcript = _f[0], setTranscript = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(0), recordingTime = _h[0], setRecordingTime = _h[1];
    var waveAnimation = (0, react_native_reanimated_1.useSharedValue)(0);
    var scaleAnimation = (0, react_native_reanimated_1.useSharedValue)(1);
    (0, react_1.useEffect)(function () {
        var interval;
        if (isRecording) {
            interval = setInterval(function () {
                setRecordingTime(function (prev) { return prev + 1; });
            }, 1000);
        }
        return function () { return clearInterval(interval); };
    }, [isRecording]);
    (0, react_1.useEffect)(function () {
        if (isRecording) {
            waveAnimation.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSpring)(1, { damping: 0.5, stiffness: 100 }), -1, true);
            scaleAnimation.value = (0, react_native_reanimated_1.withTiming)(1.1, { duration: 300 });
        }
        else {
            waveAnimation.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 300 });
            scaleAnimation.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 300 });
        }
    }, [isRecording]);
    var waveAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        opacity: 0.5 + waveAnimation.value * 0.5,
        height: 30 + waveAnimation.value * 40,
    }); });
    var buttonAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scaleAnimation.value }],
    }); });
    var startRecording = function () { return __awaiter(_this, void 0, void 0, function () {
        var hasPermission, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError(null);
                    setTranscript('');
                    setRecordingTime(0);
                    return [4 /*yield*/, SpeechToTextService_1.speechToTextService.requestPermissions()];
                case 1:
                    hasPermission = _a.sent();
                    if (!hasPermission) {
                        setError('Microphone permission denied. Please enable it in settings.');
                        return [2 /*return*/];
                    }
                    // Check if speech recognition is supported
                    if (!SpeechToTextService_1.speechToTextService.isSupported()) {
                        setError('Speech recognition is not supported on this device.');
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, SpeechToTextService_1.speechToTextService.startListening(function (result) {
                            setTranscript(result.text);
                        }, function (errorMessage) {
                            setError(errorMessage);
                            stopRecording();
                        }, language)];
                case 3:
                    _a.sent();
                    setIsRecording(true);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    setError('Failed to start recording. Please try again.');
                    console.error('Recording error:', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var stopRecording = function () { return __awaiter(_this, void 0, void 0, function () {
        var summarizedResult, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isRecording)
                        return [2 /*return*/];
                    setIsRecording(false);
                    return [4 /*yield*/, SpeechToTextService_1.speechToTextService.stopListening()];
                case 1:
                    _a.sent();
                    if (!transcript.trim()) return [3 /*break*/, 6];
                    setIsProcessing(true);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, NoteSummarizerService_1.noteSummarizerService.summarizeText(transcript, { subject: subject, chapter: chapter, language: language })];
                case 3:
                    summarizedResult = _a.sent();
                    onTranscriptionComplete(summarizedResult.summary);
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _a.sent();
                    console.error('Summarization error:', err_2);
                    onTranscriptionComplete(transcript);
                    return [3 /*break*/, 6];
                case 5:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var styles = getStyles(colors, isDark);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
    };
    return (<react_native_1.View style={styles.container}>
      {/* Waveform visualization */}
      <react_native_1.View style={styles.waveformContainer}>
        {Array.from({ length: 5 }).map(function (_, index) { return (<react_native_reanimated_1.default.View key={index} style={[
                styles.waveformBar,
                waveAnimatedStyle,
                {
                    opacity: isRecording ? 1 : 0.3,
                },
            ]}/>); })}
      </react_native_1.View>

      {/* Live transcript */}
      {(isRecording || transcript) && (<react_native_1.View style={styles.transcriptContainer}>
          {isRecording && (<react_native_1.View style={styles.recordingIndicator}>
              <react_native_1.View style={[styles.recordingDot, { backgroundColor: colors.error }]}/>
              <react_native_1.Text style={styles.recordingTime}>{formatTime(recordingTime)}</react_native_1.Text>
            </react_native_1.View>)}
          <react_native_1.Text style={styles.transcript} numberOfLines={3}>
            {transcript || (isRecording ? 'Listening...' : '')}
          </react_native_1.Text>
        </react_native_1.View>)}

      {/* Error message */}
      {error && (<react_native_1.View style={styles.errorContainer}>
          <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>
        </react_native_1.View>)}

      {/* Processing indicator */}
      {isProcessing && (<react_native_1.View style={styles.processingContainer}>
          <react_native_1.ActivityIndicator size="small" color={colors.primary}/>
          <react_native_1.Text style={styles.processingText}>Processing...</react_native_1.Text>
        </react_native_1.View>)}

      {/* Record button */}
      <react_native_1.View style={styles.buttonContainer}>
        <react_native_reanimated_1.default.View style={buttonAnimatedStyle}>
          <react_native_1.TouchableOpacity style={[
            styles.recordButton,
            isRecording && styles.recordingButton,
        ]} onPress={isRecording ? stopRecording : startRecording} disabled={isProcessing} activeOpacity={0.7}>
            <react_native_1.Text style={styles.recordButtonText}>
              {isRecording ? '⏹' : '🎙️'}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_reanimated_1.default.View>
        <react_native_1.Text style={styles.buttonLabel}>
          {isRecording ? 'Tap to stop' : 'Tap to record'}
        </react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        padding: theme_1.Spacing.md,
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        gap: 4,
        marginBottom: theme_1.Spacing.md,
    },
    waveformBar: {
        width: 6,
        backgroundColor: colors.primary,
        borderRadius: theme_1.BorderRadius.full,
    },
    transcriptContainer: {
        width: '100%',
        minHeight: 60,
        marginBottom: theme_1.Spacing.md,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.sm,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: theme_1.BorderRadius.full,
        marginRight: theme_1.Spacing.sm,
    },
    recordingTime: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.error,
    },
    transcript: {
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    errorContainer: {
        width: '100%',
        padding: theme_1.Spacing.sm,
        backgroundColor: "".concat(colors.error, "20"),
        borderRadius: theme_1.BorderRadius.md,
        marginBottom: theme_1.Spacing.md,
    },
    errorText: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.error,
        textAlign: 'center',
    },
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    processingText: {
        marginLeft: theme_1.Spacing.sm,
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    recordButton: {
        width: 64,
        height: 64,
        borderRadius: theme_1.BorderRadius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    recordingButton: {
        backgroundColor: colors.error,
    },
    recordButtonText: {
        fontSize: theme_1.FontSizes.xl,
    },
    buttonLabel: {
        marginTop: theme_1.Spacing.sm,
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
}); };
