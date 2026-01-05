"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoinDisplay;
var react_1 = require("react");
var react_native_1 = require("react-native");
var userStore_1 = require("@/store/userStore");
var vector_icons_1 = require("@expo/vector-icons");
var theme_1 = require("@/constants/theme");
function CoinDisplay(_a) {
    var _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showLabel, showLabel = _c === void 0 ? true : _c, _d = _a.animated, animated = _d === void 0 ? false : _d, style = _a.style;
    var gamificationData = (0, userStore_1.useUserStore)().gamificationData;
    var animatedValue = react_1.default.useState(new react_native_1.Animated.Value(1))[0];
    var getIconSize = function () {
        switch (size) {
            case 'small': return 16;
            case 'large': return 32;
            default: return 24;
        }
    };
    var getTextSize = function () {
        switch (size) {
            case 'small': return theme_1.FontSizes.sm;
            case 'large': return theme_1.FontSizes.lg;
            default: return theme_1.FontSizes.md;
        }
    };
    var triggerAnimation = function () {
        if (animated) {
            react_native_1.Animated.sequence([
                react_native_1.Animated.timing(animatedValue, {
                    toValue: 1.3,
                    duration: 200,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };
    react_1.default.useEffect(function () {
        if (animated) {
            triggerAnimation();
        }
    }, [gamificationData.smartCoins]);
    var styles = getStyles(getIconSize(), getTextSize());
    return (<react_native_1.View style={[styles.container, style]}>
      <react_native_1.Animated.View style={[styles.coinContainer, { transform: [{ scale: animatedValue }] }]}>
        <vector_icons_1.MaterialCommunityIcons name="currency-usd" size={getIconSize()} color="#FFD700" style={styles.coinIcon}/>
      </react_native_1.Animated.View>
      <react_native_1.Text style={[styles.amount, { fontSize: getTextSize() }]}>
        {gamificationData.smartCoins.toLocaleString()}
      </react_native_1.Text>
      {showLabel && (<react_native_1.Text style={[styles.label, { fontSize: getTextSize() - 2 }]}>
          SmartCoins
        </react_native_1.Text>)}
    </react_native_1.View>);
}
var getStyles = function (iconSize, textSize) { return react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinContainer: {
        marginRight: 8,
    },
    coinIcon: {
        textShadowColor: '#FFA500',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    amount: {
        fontWeight: theme_1.FontWeights.bold,
        color: '#FFD700',
        marginRight: 4,
    },
    label: {
        color: '#999999',
        fontWeight: theme_1.FontWeights.medium,
    },
}); };
