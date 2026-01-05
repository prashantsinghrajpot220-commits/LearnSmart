"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animations = void 0;
var react_native_reanimated_1 = require("react-native-reanimated");
exports.Animations = {
    duration: {
        fast: 150,
        normal: 300,
        slow: 500,
        stagger: 100,
    },
    easing: {
        standard: react_native_reanimated_1.Easing.bezier(0.4, 0.0, 0.2, 1),
        decelerate: react_native_reanimated_1.Easing.bezier(0.0, 0.0, 0.2, 1),
        accelerate: react_native_reanimated_1.Easing.bezier(0.4, 0.0, 1, 1),
        bounce: react_native_reanimated_1.Easing.bounce,
    },
    transitions: {
        fade: {
            duration: 300,
        },
        slide: {
            duration: 300,
        },
        scale: {
            duration: 200,
        },
    },
};
exports.default = exports.Animations;
