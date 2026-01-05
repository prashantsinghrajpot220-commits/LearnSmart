"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordInput = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
exports.PasswordInput = (0, react_1.forwardRef)(function (_a, ref) {
    var value = _a.value, onChangeText = _a.onChangeText, error = _a.error, onFocus = _a.onFocus, onBlur = _a.onBlur, onTogglePassword = _a.onTogglePassword;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _b = (0, react_1.useState)(false), isPasswordVisible = _b[0], setIsPasswordVisible = _b[1];
    var _c = (0, react_1.useState)(false), isFocused = _c[0], setIsFocused = _c[1];
    var eyeAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var dotAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(1); }, []);
    var handleFocus = function () {
        setIsFocused(true);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    };
    var handleBlur = function () {
        setIsFocused(false);
        onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    };
    var togglePassword = function () {
        var newVisible = !isPasswordVisible;
        setIsPasswordVisible(newVisible);
        onTogglePassword === null || onTogglePassword === void 0 ? void 0 : onTogglePassword(newVisible);
        react_native_1.Animated.timing(eyeAnim, {
            toValue: newVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
            easing: react_native_1.Easing.out(react_native_1.Easing.ease),
        }).start();
        react_native_1.Animated.timing(dotAnim, {
            toValue: newVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
            easing: react_native_1.Easing.out(react_native_1.Easing.back(1.5)),
        }).start();
    };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
        <react_native_1.Text style={styles.label}>Password</react_native_1.Text>
        <react_native_1.View style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            error && styles.inputWrapperError,
        ]}>
          <react_native_1.View style={styles.textContainer}>
            {value.length > 0 && !isPasswordVisible ? (<react_native_1.View style={styles.passwordDots}>
                {Array.from({ length: Math.min(value.length, 12) }).map(function (_, index) { return (<react_native_1.Animated.View key={index} style={[
                    styles.dot,
                    {
                        backgroundColor: colors.text,
                        opacity: dotAnim,
                        transform: [
                            {
                                scale: dotAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 1],
                                }),
                            },
                        ],
                    },
                ]}/>); })}
              </react_native_1.View>) : (<react_native_1.TextInput ref={ref} style={styles.input} placeholder="Enter your password" placeholderTextColor={colors.textSecondary} secureTextEntry={!isPasswordVisible} value={value} onChangeText={onChangeText} onFocus={handleFocus} onBlur={handleBlur} autoCapitalize="none"/>)}
          </react_native_1.View>
          <react_native_1.TouchableOpacity style={styles.eyeButton} onPress={togglePassword} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
            <react_native_1.Animated.View style={[
            styles.eyeIconWrapper,
            {
                transform: [
                    {
                        scale: eyeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.2],
                        }),
                    },
                ],
            },
        ]}>
              <vector_icons_1.Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={isFocused ? colors.primary : colors.textSecondary}/>
            </react_native_1.Animated.View>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
        {error && <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>}
      </react_native_1.View>);
});
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            marginBottom: theme_1.Spacing.lg,
        },
        label: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            borderWidth: 1,
            borderColor: colors.lightGray,
            paddingHorizontal: theme_1.Spacing.md,
        },
        inputWrapperFocused: {
            borderColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
        },
        inputWrapperError: {
            borderColor: colors.error,
        },
        textContainer: {
            flex: 1,
            paddingVertical: theme_1.Spacing.md,
        },
        input: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            padding: 0,
            margin: 0,
        },
        passwordDots: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        eyeButton: {
            padding: theme_1.Spacing.xs,
        },
        eyeIconWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        errorText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.error,
            marginTop: theme_1.Spacing.xs,
        },
    });
};
