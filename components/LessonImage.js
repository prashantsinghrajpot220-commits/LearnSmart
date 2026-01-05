"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonImage = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var LessonImage = function (_a) {
    var url = _a.url, altText = _a.altText, _b = _a.animationType, animationType = _b === void 0 ? 'fade-in' : _b;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var opacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var translateY = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(20); }, []);
    (0, react_1.useEffect)(function () {
        var animations = [
            react_native_1.Animated.timing(opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ];
        if (animationType === 'slide') {
            animations.push(react_native_1.Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }));
        }
        react_native_1.Animated.parallel(animations).start();
    }, [animationType, opacity, translateY]);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Animated.View style={{ opacity: opacity, transform: [{ translateY: translateY }] }}>
        <react_native_1.Image source={{ uri: url }} style={styles.image} accessibilityLabel={altText || 'Lesson Illustration'} resizeMode="cover"/>
        {altText && <react_native_1.Text style={[styles.altText, { color: colors.textSecondary }]}>{altText}</react_native_1.Text>}
      </react_native_1.Animated.View>
    </react_native_1.View>);
};
exports.LessonImage = LessonImage;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginVertical: theme_1.Spacing.lg,
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: theme_1.BorderRadius.lg,
        backgroundColor: '#f0f0f0',
    },
    altText: {
        marginTop: theme_1.Spacing.xs,
        fontSize: theme_1.FontSizes.xs,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
