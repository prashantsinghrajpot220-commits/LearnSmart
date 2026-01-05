"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkModeToggle = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
var DarkModeToggle = function () {
    var _a = (0, ThemeContext_1.useTheme)(), isDark = _a.isDark, toggleTheme = _a.toggleTheme, colors = _a.colors;
    var animatedValue = react_1.default.useMemo(function () { return new react_native_1.Animated.Value(0); }, []);
    var handleToggle = function () {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animatedValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
        toggleTheme();
    };
    var animatedStyle = {
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                }),
            },
        ],
    };
    return (<react_native_1.TouchableOpacity onPress={handleToggle} activeOpacity={0.7} style={styles.container}>
      <react_native_1.Animated.View style={animatedStyle}>
        <vector_icons_1.Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary}/>
      </react_native_1.Animated.View>
    </react_native_1.TouchableOpacity>);
};
exports.DarkModeToggle = DarkModeToggle;
var styles = react_native_1.StyleSheet.create({
    container: {
        padding: theme_1.Spacing.sm,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
});
