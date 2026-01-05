"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuizResultsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var quizStore_1 = require("@/store/quizStore");
var vector_icons_1 = require("@expo/vector-icons");
function QuizResultsScreen(_a) {
    var onRetry = _a.onRetry, onBackToLesson = _a.onBackToLesson;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var _c = (0, quizStore_1.useQuizStore)(), questions = _c.questions, score = _c.score, selectedAnswers = _c.selectedAnswers;
    var animationProgress = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var scaleValue = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0.8); }, []);
    var confettiAnimations = (0, react_1.useMemo)(function () { return Array.from({ length: 12 }, function () { return new react_native_1.Animated.Value(0); }); }, []);
    var correctCount = questions.filter(function (q, i) { return selectedAnswers[i] === q.correctAnswer; }).length;
    var incorrectCount = questions.length - correctCount;
    var isHighScore = score >= 70;
    // Memoize animated values that are used in render
    var contentOpacity = animationProgress;
    var scoreScale = (0, react_1.useMemo)(function () {
        return animationProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 1.1, 1],
        });
    }, [animationProgress]);
    var celebrationScale = (0, react_1.useMemo)(function () {
        return animationProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1.2, 1],
        });
    }, [animationProgress]);
    (0, react_1.useEffect)(function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(animationProgress, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: react_native_1.Easing.out(react_native_1.Easing.cubic),
            }),
            react_native_1.Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            }),
        ]).start();
        if (isHighScore) {
            react_native_1.Animated.stagger(150, confettiAnimations.map(function (anim) {
                return react_native_1.Animated.timing(anim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                });
            })).start();
        }
    }, [isHighScore, animationProgress, scaleValue, confettiAnimations]);
    var handleRetry = function () {
        onRetry === null || onRetry === void 0 ? void 0 : onRetry();
    };
    var handleBackToLesson = function () {
        onBackToLesson === null || onBackToLesson === void 0 ? void 0 : onBackToLesson();
    };
    var styles = getStyles(colors, isDark);
    return (<react_native_1.View style={styles.container}>
      {isHighScore && confettiAnimations.map(function (anim, index) { return (<react_native_1.Animated.View key={index} style={[
                styles.confetti,
                {
                    left: "".concat((index * 8 + 5) % 90, "%"),
                    opacity: anim,
                    transform: [
                        {
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 60],
                            }),
                        },
                        {
                            rotate: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', "".concat((index % 2 === 0 ? 45 : -45), "deg")],
                            }),
                        },
                    ],
                },
            ]}/>); })}

      <react_native_1.Animated.View style={[
            styles.content,
            {
                opacity: contentOpacity,
                transform: [{ scale: scaleValue }],
            },
        ]}>
        <react_native_1.View style={styles.iconContainer}>
          {isHighScore ? (<>
              <react_native_1.Animated.View style={[
                styles.celebrationCircle,
                {
                    transform: [{ scale: celebrationScale }],
                },
            ]}>
                <vector_icons_1.Feather name="award" size={64} color="#FFFFFF"/>
              </react_native_1.Animated.View>
              <react_native_1.Animated.Text style={styles.celebrationEmoji}>
                🎉
              </react_native_1.Animated.Text>
            </>) : (<react_native_1.View style={styles.resultCircle}>
              <vector_icons_1.Feather name="rotate-ccw" size={48} color={colors.primary}/>
            </react_native_1.View>)}
        </react_native_1.View>

        <react_native_1.Text style={styles.title}>
          {isHighScore ? 'Amazing Job!' : 'Quiz Complete!'}
        </react_native_1.Text>

        <react_native_1.Animated.View style={[
            styles.scoreContainer,
            {
                transform: [{ scale: scoreScale }],
            },
        ]}>
          <react_native_1.Text style={styles.scoreText}>{score}%</react_native_1.Text>
          <react_native_1.Text style={styles.scoreLabel}>Score</react_native_1.Text>
        </react_native_1.Animated.View>

        <react_native_1.View style={styles.statsContainer}>
          <react_native_1.View style={styles.statCard}>
            <react_native_1.View style={[styles.statIcon, styles.correctIcon]}>
              <vector_icons_1.Feather name="check" size={24} color="#FFFFFF"/>
            </react_native_1.View>
            <react_native_1.Text style={styles.statValue}>{correctCount}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Correct</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={styles.statCard}>
            <react_native_1.View style={[styles.statIcon, styles.incorrectIcon]}>
              <vector_icons_1.Feather name="x" size={24} color="#FFFFFF"/>
            </react_native_1.View>
            <react_native_1.Text style={styles.statValue}>{incorrectCount}</react_native_1.Text>
            <react_native_1.Text style={styles.statLabel}>Incorrect</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.Text style={styles.encouragement}>
          {isHighScore
            ? "Outstanding performance! You've mastered this topic!"
            : score >= 50
                ? 'Good effort! Review the material and try again!'
                : 'Keep learning! Practice makes perfect!'}
        </react_native_1.Text>

        <react_native_1.View style={styles.buttonContainer}>
          <react_native_1.TouchableOpacity style={[styles.button, styles.retryButton]} onPress={handleRetry} activeOpacity={0.8}>
            <vector_icons_1.Feather name="rotate-ccw" size={20} color="#FFFFFF"/>
            <react_native_1.Text style={styles.retryButtonText}>Retry Quiz</react_native_1.Text>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBackToLesson} activeOpacity={0.8}>
            <vector_icons_1.Feather name="arrow-left" size={20} color={colors.primary}/>
            <react_native_1.Text style={styles.backButtonText}>Back to Lesson</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.xl,
        },
        confetti: {
            position: 'absolute',
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.primary,
            top: -20,
        },
        content: {
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
        },
        iconContainer: {
            position: 'relative',
            marginBottom: theme_1.Spacing.xl,
        },
        celebrationCircle: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
        },
        resultCircle: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.cardBackground,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: colors.primary,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        celebrationEmoji: {
            position: 'absolute',
            fontSize: 32,
            bottom: -10,
            right: -10,
        },
        title: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: isDark ? colors.text : colors.charcoal,
            marginBottom: theme_1.Spacing.xl,
            textAlign: 'center',
        },
        scoreContainer: {
            alignItems: 'center',
            marginBottom: theme_1.Spacing.xl,
            padding: theme_1.Spacing.xl,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.xl,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
            minWidth: 160,
        },
        scoreText: {
            fontSize: 56,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.primary,
        },
        scoreLabel: {
            fontSize: theme_1.FontSizes.lg,
            color: colors.textSecondary,
            fontWeight: theme_1.FontWeights.medium,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.xl,
            width: '100%',
        },
        statCard: {
            alignItems: 'center',
            padding: theme_1.Spacing.lg,
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            marginHorizontal: theme_1.Spacing.md,
            minWidth: 100,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        statIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.sm,
        },
        correctIcon: {
            backgroundColor: colors.primary,
        },
        incorrectIcon: {
            backgroundColor: '#E07856',
        },
        statValue: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: isDark ? colors.text : colors.charcoal,
        },
        statLabel: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
        encouragement: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme_1.Spacing.xl,
            lineHeight: theme_1.FontSizes.md * 1.5,
            paddingHorizontal: theme_1.Spacing.lg,
        },
        buttonContainer: {
            width: '100%',
            maxWidth: 320,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: theme_1.Spacing.md,
            paddingHorizontal: theme_1.Spacing.xl,
            borderRadius: theme_1.BorderRadius.lg,
            marginBottom: theme_1.Spacing.md,
            minHeight: 56,
        },
        retryButton: {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        retryButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: '#FFFFFF',
            marginLeft: theme_1.Spacing.sm,
        },
        backButton: {
            backgroundColor: colors.cardBackground,
            borderWidth: 2,
            borderColor: colors.primary,
        },
        backButtonText: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.primary,
            marginLeft: theme_1.Spacing.sm,
        },
    });
};
