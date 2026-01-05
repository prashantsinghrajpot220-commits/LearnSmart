"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoinRewardAnimation;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var _a = react_native_1.Dimensions.get('window'), screenWidth = _a.width, screenHeight = _a.height;
function CoinRewardAnimation(_a) {
    var amount = _a.amount, _b = _a.duration, duration = _b === void 0 ? 2000 : _b, onAnimationComplete = _a.onAnimationComplete;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var gamificationData = (0, userStore_1.useUserStore)().gamificationData;
    var _c = (0, react_1.useState)(true), visible = _c[0], setVisible = _c[1];
    var coinAnimation = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var textAnimation = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var scaleAnimation = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var opacityAnimation = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(1); }, []);
    (0, react_1.useEffect)(function () {
        // Initial pop animation
        react_native_1.Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            easing: react_native_1.Easing.out(react_native_1.Easing.back(1.7)),
            useNativeDriver: true,
        }).start();
        // Float up animation
        react_native_1.Animated.timing(coinAnimation, {
            toValue: -100,
            duration: duration,
            easing: react_native_1.Easing.out(react_native_1.Easing.quad),
            useNativeDriver: true,
        }).start();
        // Fade in text after delay
        setTimeout(function () {
            react_native_1.Animated.timing(textAnimation, {
                toValue: 1,
                duration: 500,
                easing: react_native_1.Easing.out(react_native_1.Easing.quad),
                useNativeDriver: true,
            }).start();
        }, 200);
        // Fade out after duration
        react_native_1.Animated.timing(opacityAnimation, {
            toValue: 0,
            delay: duration - 500,
            duration: 500,
            useNativeDriver: true,
        }).start(function () {
            setVisible(false);
            onAnimationComplete === null || onAnimationComplete === void 0 ? void 0 : onAnimationComplete();
        });
    }, []);
    if (!visible)
        return null;
    return (<react_native_1.View style={[styles.container, { top: screenHeight / 3, left: screenWidth / 2 }]}>
      <react_native_1.Animated.View style={[
            styles.content,
            {
                transform: [
                    { translateY: coinAnimation },
                    { scale: scaleAnimation },
                ],
                opacity: opacityAnimation,
            },
        ]}>
        <react_native_1.View style={[styles.coinContainer, { backgroundColor: colors.cardBackground }]}>
          <vector_icons_1.MaterialCommunityIcons name="cash" size={60} color="#FFD700"/>
          <react_native_1.Animated.Text style={[
            styles.amountText,
            {
                color: colors.text,
                opacity: textAnimation,
                transform: [{ scale: textAnimation }],
            },
        ]}>
            +{amount}
          </react_native_1.Animated.Text>
        </react_native_1.View>
        <react_native_1.Animated.Text style={[
            styles.congratsText,
            {
                color: colors.text,
                opacity: textAnimation,
            },
        ]}>
          {amount > 1 ? 'Coins earned!' : 'Coin earned!'}
        </react_native_1.Animated.Text>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        transform: [{ translateX: -75 }],
        zIndex: 9999,
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    coinContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    amountText: {
        fontSize: 36,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 30,
    },
    congratsText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});
