"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuizCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = require("react-native-reanimated");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var quizStore_1 = require("@/store/quizStore");
var sanitizer_1 = require("@/utils/sanitizer");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
var SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
function QuizCard(_a) {
    var question = _a.question, questionNumber = _a.questionNumber, totalQuestions = _a.totalQuestions, onNext = _a.onNext, onPrevious = _a.onPrevious;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var _c = (0, quizStore_1.useQuizStore)(), selectAnswer = _c.selectAnswer, selectedAnswers = _c.selectedAnswers;
    var isLastQuestion = (0, quizStore_1.useQuizProgress)().isLastQuestion;
    var isAnswered = (0, quizStore_1.useIsQuestionAnswered)(questionNumber - 1);
    var safeQuestionText = (0, react_1.useMemo)(function () { return (0, sanitizer_1.sanitizeTextForDisplay)(question.question, { maxLength: 500 }); }, [question.question]);
    var safeOptions = (0, react_1.useMemo)(function () { return question.options.map(function (opt) { return (0, sanitizer_1.sanitizeTextForDisplay)(opt, { maxLength: 200 }); }); }, [question.options]);
    var safeExplanationText = (0, react_1.useMemo)(function () { return (0, sanitizer_1.sanitizeTextForDisplay)(question.explanation, { maxLength: 800 }); }, [question.explanation]);
    var animationState = (0, react_1.useState)({
        scale: new react_native_1.Animated.Value(1),
        translateX: new react_native_1.Animated.Value(0),
        opacity: new react_native_1.Animated.Value(1),
        feedbackOpacity: new react_native_1.Animated.Value(0),
    })[0];
    var handleOptionPress = (0, react_1.useCallback)(function (optionIndex) {
        if (isAnswered)
            return;
        // Animate button press
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animationState.scale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animationState.scale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        // Select answer
        selectAnswer(questionNumber - 1, optionIndex);
        // Show feedback animation
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animationState.feedbackOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.delay(2000),
            react_native_1.Animated.timing(animationState.feedbackOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isAnswered, questionNumber, selectAnswer, animationState]);
    var handleSwipeLeft = (0, react_1.useCallback)(function () {
        if (!isLastQuestion && isAnswered) {
            (0, react_native_reanimated_1.runOnJS)(onNext !== null && onNext !== void 0 ? onNext : (function () { }))();
        }
    }, [isLastQuestion, isAnswered, onNext]);
    var gesture = react_native_gesture_handler_1.Gesture.Pan()
        .onUpdate(function (event) {
        if (!isAnswered)
            return;
        var translationX = event.translationX;
        animationState.translateX.setValue(translationX);
        // Calculate swipe progress
        var progress = Math.min(Math.abs(translationX) / SWIPE_THRESHOLD, 1);
        animationState.opacity.setValue(1 - progress * 0.3);
    })
        .onEnd(function (event) {
        if (!isAnswered) {
            animationState.translateX.setValue(0);
            animationState.opacity.setValue(1);
            return;
        }
        var translationX = event.translationX;
        if (translationX < -SWIPE_THRESHOLD && !isLastQuestion) {
            react_native_1.Animated.timing(animationState.translateX, {
                toValue: -SCREEN_WIDTH,
                duration: 200,
                useNativeDriver: true,
            }).start(function () {
                animationState.translateX.setValue(0);
                animationState.opacity.setValue(1);
                (0, react_native_reanimated_1.runOnJS)(handleSwipeLeft)();
            });
        }
        else {
            react_native_1.Animated.parallel([
                react_native_1.Animated.spring(animationState.translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.spring(animationState.opacity, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    });
    var getOptionStyle = function (index) {
        var isSelected = selectedAnswers[questionNumber - 1] === index;
        var isCorrect = question.correctAnswer === index;
        var showFeedback = isAnswered;
        var backgroundColor = colors.cardBackground;
        var borderColor = colors.lightGray;
        var textColor = colors.text;
        if (showFeedback) {
            if (isCorrect) {
                backgroundColor = isDark ? '#1E3D2A' : '#E8F5E9';
                borderColor = colors.primary;
                textColor = isDark ? '#A8D5BA' : '#2E7D32';
            }
            else if (isSelected && !isCorrect) {
                backgroundColor = isDark ? '#3D1E1E' : '#FFEBEE';
                borderColor = '#E07856';
                textColor = isDark ? '#F5A5A5' : '#C62828';
            }
        }
        else if (isSelected) {
            backgroundColor = isDark ? '#2A3D2A' : '#F5F1E8';
            borderColor = colors.primary;
            textColor = colors.primary;
        }
        return { backgroundColor: backgroundColor, borderColor: borderColor, textColor: textColor };
    };
    var styles = getStyles(colors, isDark);
    return (<react_native_gesture_handler_1.GestureDetector gesture={gesture}>
      <react_native_1.Animated.View style={[
            styles.card,
            {
                transform: [
                    { translateX: animationState.translateX },
                    { scale: animationState.scale },
                ],
                opacity: animationState.opacity,
            },
        ]}>
        {/* Progress Bar */}
        <react_native_1.View style={styles.progressContainer}>
          <react_native_1.View style={styles.progressBackground}>
            <react_native_1.Animated.View style={[
            styles.progressFill,
            {
                width: "".concat((questionNumber / totalQuestions) * 100, "%"),
            },
        ]}/>
          </react_native_1.View>
          <react_native_1.Text style={styles.progressText}>
            Question {questionNumber} of {totalQuestions}
          </react_native_1.Text>
        </react_native_1.View>

        {/* Question */}
        <react_native_1.View style={styles.questionContainer}>
          <react_native_1.Text style={styles.questionText}>{safeQuestionText}</react_native_1.Text>
        </react_native_1.View>

        {/* Options */}
        <react_native_1.View style={styles.optionsContainer}>
          {safeOptions.map(function (option, index) {
            var optionStyle = getOptionStyle(index);
            return (<react_native_1.TouchableOpacity key={index} style={[
                    styles.optionButton,
                    {
                        backgroundColor: optionStyle.backgroundColor,
                        borderColor: optionStyle.borderColor,
                    },
                ]} onPress={function (e) { return handleOptionPress(index); }} disabled={isAnswered} activeOpacity={isAnswered ? 1 : 0.8}>
                <react_native_1.View style={[
                    styles.optionIndicator,
                    {
                        backgroundColor: optionStyle.backgroundColor,
                        borderColor: optionStyle.borderColor,
                    },
                ]}>
                  <react_native_1.Text style={[
                    styles.optionLetter,
                    { color: isAnswered && question.correctAnswer === index ? colors.primary : colors.textSecondary },
                ]}>
                    {String.fromCharCode(65 + index)}
                  </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={[styles.optionText, { color: optionStyle.textColor }]}>
                  {option}
                </react_native_1.Text>
                {isAnswered && question.correctAnswer === index && (<react_native_1.Text style={styles.correctIcon}>✓</react_native_1.Text>)}
                {isAnswered && selectedAnswers[questionNumber - 1] === index && question.correctAnswer !== index && (<react_native_1.Text style={styles.wrongIcon}>✗</react_native_1.Text>)}
              </react_native_1.TouchableOpacity>);
        })}
        </react_native_1.View>

        {/* Feedback/Explanation */}
        {isAnswered && (<react_native_1.Animated.View style={[
                styles.explanationContainer,
                {
                    backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                    opacity: animationState.feedbackOpacity,
                },
            ]}>
            <react_native_1.Text style={styles.explanationTitle}>
              {selectedAnswers[questionNumber - 1] === question.correctAnswer
                ? '✓ Correct!'
                : '✗ Not quite right'}
            </react_native_1.Text>
            <react_native_1.Text style={styles.explanationText}>{safeExplanationText}</react_native_1.Text>
          </react_native_1.Animated.View>)}

        {/* Swipe hint */}
        {isAnswered && !isLastQuestion && (<react_native_1.View style={styles.swipeHint}>
            <react_native_1.Text style={styles.swipeHintText}>← Swipe left for next question</react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.Animated.View>
    </react_native_gesture_handler_1.GestureDetector>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        card: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.xl,
            padding: theme_1.Spacing.xl,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        progressContainer: {
            marginBottom: theme_1.Spacing.lg,
        },
        progressBackground: {
            height: 8,
            backgroundColor: colors.lightGray,
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 4,
        },
        progressText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginTop: theme_1.Spacing.xs,
            textAlign: 'center',
        },
        questionContainer: {
            marginBottom: theme_1.Spacing.xl,
        },
        questionText: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: isDark ? colors.text : colors.charcoal,
            lineHeight: theme_1.FontSizes.lg * 1.4,
        },
        optionsContainer: {
            flex: 1,
        },
        optionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            borderWidth: 2,
            marginBottom: theme_1.Spacing.md,
            minHeight: 56,
        },
        optionIndicator: {
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        optionLetter: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.bold,
        },
        optionText: {
            flex: 1,
            fontSize: theme_1.FontSizes.md,
            lineHeight: theme_1.FontSizes.md * 1.4,
        },
        correctIcon: {
            fontSize: theme_1.FontSizes.lg,
            color: colors.primary,
            marginLeft: theme_1.Spacing.sm,
        },
        wrongIcon: {
            fontSize: theme_1.FontSizes.lg,
            color: '#E07856',
            marginLeft: theme_1.Spacing.sm,
        },
        explanationContainer: {
            marginTop: theme_1.Spacing.md,
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
        },
        explanationTitle: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.primary,
            marginBottom: theme_1.Spacing.sm,
        },
        explanationText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.sm * 1.5,
        },
        swipeHint: {
            alignItems: 'center',
            marginTop: theme_1.Spacing.md,
            padding: theme_1.Spacing.sm,
        },
        swipeHintText: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            opacity: 0.7,
        },
    });
};
