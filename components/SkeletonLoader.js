"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Skeleton;
exports.QuestionSkeleton = QuestionSkeleton;
exports.CardSkeleton = CardSkeleton;
exports.TextSkeleton = TextSkeleton;
exports.ChatMessageSkeleton = ChatMessageSkeleton;
exports.QuizResultsSkeleton = QuizResultsSkeleton;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
function Skeleton(_a) {
    var _b = _a.width, width = _b === void 0 ? '100%' : _b, height = _a.height, style = _a.style, _c = _a.borderRadius, borderRadius = _c === void 0 ? theme_1.BorderRadius.sm : _c;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var animatedValue = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    (0, react_1.useEffect)(function () {
        var animation = react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedValue, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]));
        animation.start();
        return function () {
            animation.stop();
        };
    }, [animatedValue]);
    var translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });
    var widthValue = typeof width === 'number' ? width : '100%';
    return (<react_native_1.View style={[
            styles.skeleton,
            {
                width: widthValue,
                height: height,
                borderRadius: borderRadius,
                backgroundColor: colors.lightGray,
            },
            style,
        ]}>
      <react_native_1.Animated.View style={[
            styles.shimmer,
            {
                width: SCREEN_WIDTH,
                height: height + 40,
                transform: [{ translateX: translateX }],
            },
        ]}/>
    </react_native_1.View>);
}
function QuestionSkeleton(_a) {
    var style = _a.style;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.questionSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <Skeleton width={120} height={20} style={styles.questionNumber}/>
      <react_native_1.View style={styles.questionTextContainer}>
        <Skeleton width="100%" height={24} style={styles.questionLine}/>
        <Skeleton width="85%" height={24} style={styles.questionLine}/>
      </react_native_1.View>
      <react_native_1.View style={styles.optionsContainer}>
        {[1, 2, 3, 4].map(function (i) { return (<react_native_1.View key={i} style={styles.optionRow}>
            <Skeleton width={28} height={28} borderRadius={14} style={styles.optionCircle}/>
            <Skeleton width={i === 2 || i === 3 ? '70%' : '85%'} height={20} style={styles.optionText}/>
          </react_native_1.View>); })}
      </react_native_1.View>
    </react_native_1.View>);
}
function CardSkeleton(_a) {
    var style = _a.style;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.cardSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <react_native_1.View style={styles.cardHeader}>
        <Skeleton width={48} height={48} borderRadius={12} style={styles.cardIcon}/>
        <react_native_1.View style={styles.cardTextContainer}>
          <Skeleton width={160} height={18} style={styles.cardTitle}/>
          <Skeleton width={100} height={14} style={styles.cardSubtitle}/>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.View style={styles.cardBody}>
        <Skeleton width="100%" height={12} style={styles.cardLine}/>
        <Skeleton width="90%" height={12} style={styles.cardLine}/>
        <Skeleton width="75%" height={12} style={styles.cardLine}/>
      </react_native_1.View>
    </react_native_1.View>);
}
function TextSkeleton(_a) {
    var _b = _a.lines, lines = _b === void 0 ? 3 : _b, _c = _a.lineWidth, lineWidth = _c === void 0 ? [100, 85, 70] : _c, style = _a.style;
    return (<react_native_1.View style={[styles.textSkeleton, style]}>
      {Array.from({ length: lines }).map(function (_, index) {
            var _a;
            return (<Skeleton key={index} width={(_a = lineWidth[index]) !== null && _a !== void 0 ? _a : 100} height={16} style={styles.textLine}/>);
        })}
    </react_native_1.View>);
}
function ChatMessageSkeleton(_a) {
    var style = _a.style;
    return (<react_native_1.View style={[styles.chatMessageSkeleton, style]}>
      <react_native_1.View style={styles.chatHeader}>
        <Skeleton width={32} height={32} borderRadius={16}/>
        <Skeleton width={60} height={12} style={styles.chatName}/>
      </react_native_1.View>
      <react_native_1.View style={styles.chatTextLines}>
        <Skeleton width="100%" height={14} style={styles.chatLine}/>
        <Skeleton width="80%" height={14} style={styles.chatLine}/>
      </react_native_1.View>
    </react_native_1.View>);
}
function QuizResultsSkeleton(_a) {
    var style = _a.style;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.resultsSkeleton, { backgroundColor: colors.cardBackground }, style]}>
      <Skeleton width={120} height={120} borderRadius={60} style={styles.scoreCircle}/>
      <Skeleton width={200} height={28} style={styles.scoreText}/>
      <Skeleton width={150} height={20} style={styles.scoreLabel}/>
      <react_native_1.View style={styles.resultsStats}>
        <Skeleton width={100} height={60} borderRadius={12} style={styles.statCard}/>
        <Skeleton width={100} height={60} borderRadius={12} style={styles.statCard}/>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: -20,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    questionSkeleton: {
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
    },
    questionNumber: {
        marginBottom: theme_1.Spacing.md,
    },
    questionTextContainer: {
        marginBottom: theme_1.Spacing.lg,
    },
    questionLine: {
        marginBottom: theme_1.Spacing.sm,
    },
    optionsContainer: {
        marginTop: theme_1.Spacing.md,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
        paddingLeft: theme_1.Spacing.sm,
    },
    optionCircle: {
        marginRight: theme_1.Spacing.md,
    },
    optionText: {
        marginLeft: theme_1.Spacing.sm,
    },
    cardSkeleton: {
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    cardIcon: {
        marginRight: theme_1.Spacing.md,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        marginBottom: theme_1.Spacing.xs,
    },
    cardSubtitle: {},
    cardBody: {
        marginTop: theme_1.Spacing.sm,
    },
    cardLine: {
        marginBottom: theme_1.Spacing.sm,
    },
    textSkeleton: {},
    textLine: {
        marginBottom: theme_1.Spacing.sm,
    },
    chatMessageSkeleton: {
        padding: theme_1.Spacing.md,
        maxWidth: '80%',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.sm,
    },
    chatName: {
        marginLeft: theme_1.Spacing.sm,
    },
    chatTextLines: {},
    chatLine: {
        marginBottom: theme_1.Spacing.xs,
    },
    resultsSkeleton: {
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xl,
        alignItems: 'center',
    },
    scoreCircle: {
        marginBottom: theme_1.Spacing.lg,
    },
    scoreText: {
        marginBottom: theme_1.Spacing.sm,
    },
    scoreLabel: {
        marginBottom: theme_1.Spacing.xl,
    },
    resultsStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statCard: {
        marginHorizontal: theme_1.Spacing.sm,
    },
});
