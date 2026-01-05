"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SmartCoinDisplay;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var theme_1 = require("@/constants/theme");
var screenWidth = react_native_1.Dimensions.get('window').width;
function SmartCoinDisplay(_a) {
    var _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showLabel, showLabel = _c === void 0 ? true : _c, _d = _a.showAnimation, showAnimation = _d === void 0 ? false : _d, amount = _a.amount;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var gamificationData = (0, userStore_1.useUserStore)().gamificationData;
    var animatedValue = (0, react_1.useState)(new react_native_1.Animated.Value(0))[0];
    var currentAmount = amount !== null && amount !== void 0 ? amount : gamificationData.smartCoins;
    var previousAmountRef = (0, react_1.useRef)(currentAmount);
    (0, react_1.useEffect)(function () {
        if (showAnimation && currentAmount > previousAmountRef.current) {
            // Start animation
            react_native_1.Animated.sequence([
                react_native_1.Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        previousAmountRef.current = currentAmount;
    }, [currentAmount, showAnimation, animatedValue]);
    var sizeStyles = {
        small: {
            icon: 20,
            text: theme_1.FontSizes.sm,
            containerWidth: 80,
        },
        medium: {
            icon: 28,
            text: theme_1.FontSizes.md,
            containerWidth: 120,
        },
        large: {
            icon: 40,
            text: theme_1.FontSizes.xl,
            containerWidth: 180,
        },
    };
    var currentSize = sizeStyles[size];
    return (<react_native_1.View style={[styles.container, { width: currentSize.containerWidth }]}>
      <react_native_1.Animated.View style={[
            styles.coinWrapper,
            {
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -15],
                        }),
                    },
                    {
                        scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.2],
                        }),
                    },
                ],
            },
        ]}>
        <vector_icons_1.MaterialCommunityIcons name="cash" size={currentSize.icon} color="#FFD700"/>
      </react_native_1.Animated.View>

      <react_native_1.View style={styles.textContainer}>
        <react_native_1.Text style={[
            styles.coinAmount,
            {
                color: colors.text,
                fontSize: currentSize.text,
            },
        ]}>
          {currentAmount !== null && currentAmount !== void 0 ? currentAmount : 0}
        </react_native_1.Text>
        {showLabel && (<react_native_1.Text style={[
                styles.coinLabel,
                {
                    color: colors.textSecondary,
                    fontSize: size === 'small' ? theme_1.FontSizes.xs : theme_1.FontSizes.sm,
                },
            ]}>
            {(currentAmount !== null && currentAmount !== void 0 ? currentAmount : 0) === 1 ? 'Coin' : 'Coins'}
          </react_native_1.Text>)}
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinWrapper: {
        marginRight: 8,
    },
    textContainer: {
        flexDirection: 'column',
    },
    coinAmount: {
        fontWeight: theme_1.FontWeights.bold,
    },
    coinLabel: {
        fontWeight: theme_1.FontWeights.medium,
        marginTop: -2,
    },
});
