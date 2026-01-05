"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CartoonCharacter;
var react_1 = require("react");
var react_native_1 = require("react-native");
var lottie_react_native_1 = require("lottie-react-native");
function CartoonCharacter(_a) {
    var state = _a.state, _b = _a.size, size = _b === void 0 ? 180 : _b;
    var animationRef = (0, react_1.useRef)(null);
    var bounceAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var wiggleAnim = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var startBounce = function () {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(bounceAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
                easing: react_native_1.Easing.out(react_native_1.Easing.back(2)),
            }),
            react_native_1.Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
                easing: react_native_1.Easing.in(react_native_1.Easing.back(2)),
            }),
        ]).start();
    };
    var startWiggle = function () {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(wiggleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(wiggleAnim, {
                toValue: -1,
                duration: 100,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(wiggleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(wiggleAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };
    (0, react_1.useEffect)(function () {
        if (!animationRef.current)
            return;
        switch (state) {
            case 'idle':
                animationRef.current.play(0, 30);
                break;
            case 'curious':
                animationRef.current.play(15, 30);
                startBounce();
                break;
            case 'surprised':
                animationRef.current.play(30, 45);
                startWiggle();
                break;
            case 'happy':
                animationRef.current.play(45, 60);
                startBounce();
                break;
            case 'relaxed':
                animationRef.current.play(0, 30);
                break;
        }
    }, [state]);
    var scale = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });
    var rotation = wiggleAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-5deg', '0deg', '5deg'],
    });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Animated.View style={[
            styles.animatedContainer,
            {
                transform: [{ scale: scale }, { rotate: rotation }],
            },
        ]}>
        <lottie_react_native_1.default ref={animationRef} source={require('@/assets/animations/cartoon-owl.json')} autoPlay={false} loop={state === 'idle'} style={[styles.lottie, { width: size, height: size }]}/>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        maxWidth: react_native_1.Platform.select({ web: '100%' }),
    },
});
