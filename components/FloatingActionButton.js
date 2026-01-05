"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingActionButton = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var react_native_reanimated_1 = require("react-native-reanimated");
var FloatingActionButton = function (_a) {
    var onPress = _a.onPress, _b = _a.icon, icon = _b === void 0 ? 'robot' : _b;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    (0, react_1.useEffect)(function () {
        scale.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1.1, { duration: 1000, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }), (0, react_native_reanimated_1.withTiming)(1, { duration: 1000, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) })), -1, true);
    }, [scale]);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scale.value }],
    }); });
    return (<react_native_reanimated_1.default.View style={[
            styles.container,
            animatedStyle
        ]}>
      <react_native_1.TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
        <vector_icons_1.MaterialCommunityIcons name={icon} size={28} color={colors.white}/>
        {react_native_1.Platform.OS === 'web' && (<react_native_1.View style={[styles.tooltip, { backgroundColor: colors.text }]}>
            <react_native_1.Text style={[styles.tooltipText, { color: colors.background }]}>Chat with Smarty</react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.TouchableOpacity>
    </react_native_reanimated_1.default.View>);
};
exports.FloatingActionButton = FloatingActionButton;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        zIndex: 999,
    },
    button: __assign({ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
        },
        android: {
            elevation: 8,
        },
        web: {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }
    })),
    tooltip: {
        position: 'absolute',
        right: 64,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        width: 120,
        alignItems: 'center',
        display: 'none', // Shown on hover in CSS if possible, but for RN web we'd need more logic
    },
    tooltipText: {
        fontSize: 12,
        fontWeight: '600',
    }
});
exports.default = exports.FloatingActionButton;
