"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFocusScoreColor = exports.getFocusScoreLabel = exports.calculateFocusScore = exports.getTreeTrunkColor = exports.getTreeColor = exports.createTreeReviveAnimation = exports.createTreeDeathAnimation = exports.createGrowthAnimation = exports.interpolateGrowth = exports.getGrowthStage = exports.TREE_GROWTH_STAGES = void 0;
var react_native_1 = require("react-native");
exports.TREE_GROWTH_STAGES = [
    { growthPercentage: 0, scale: 0.2, rotation: 0, opacity: 1, description: 'Seed planted' },
    { growthPercentage: 10, scale: 0.3, rotation: 0, opacity: 1, description: 'Sprouting' },
    { growthPercentage: 20, scale: 0.4, rotation: 5, opacity: 1, description: 'Small sapling' },
    { growthPercentage: 30, scale: 0.5, rotation: 0, opacity: 1, description: 'Growing' },
    { growthPercentage: 40, scale: 0.6, rotation: -5, opacity: 1, description: 'Getting taller' },
    { growthPercentage: 50, scale: 0.7, rotation: 0, opacity: 1, description: 'Half grown' },
    { growthPercentage: 60, scale: 0.8, rotation: 3, opacity: 1, description: 'Branches forming' },
    { growthPercentage: 70, scale: 0.85, rotation: 0, opacity: 1, description: 'Almost there' },
    { growthPercentage: 80, scale: 0.9, rotation: -3, opacity: 1, description: 'Nearly full' },
    { growthPercentage: 90, scale: 0.95, rotation: 0, opacity: 1, description: 'Almost mature' },
    { growthPercentage: 100, scale: 1.0, rotation: 0, opacity: 1, description: 'Fully grown!' },
];
var getGrowthStage = function (growth) {
    for (var i = exports.TREE_GROWTH_STAGES.length - 1; i >= 0; i--) {
        if (growth >= exports.TREE_GROWTH_STAGES[i].growthPercentage) {
            return exports.TREE_GROWTH_STAGES[i];
        }
    }
    return exports.TREE_GROWTH_STAGES[0];
};
exports.getGrowthStage = getGrowthStage;
var interpolateGrowth = function (growth) {
    var stage = (0, exports.getGrowthStage)(growth);
    return {
        scale: stage.scale,
        rotation: "".concat(stage.rotation, "deg"),
    };
};
exports.interpolateGrowth = interpolateGrowth;
var createGrowthAnimation = function (currentGrowth, targetGrowth) {
    var scaleValue = new react_native_1.Animated.Value(currentGrowth / 100);
    var rotationValue = new react_native_1.Animated.Value(0);
    var targetScale = targetGrowth / 100;
    return react_native_1.Animated.parallel([
        react_native_1.Animated.timing(scaleValue, {
            toValue: targetScale,
            duration: 300,
            useNativeDriver: true,
        }),
    ]);
};
exports.createGrowthAnimation = createGrowthAnimation;
var createTreeDeathAnimation = function () {
    var opacityValue = new react_native_1.Animated.Value(1);
    var scaleValue = new react_native_1.Animated.Value(1);
    var rotationValue = new react_native_1.Animated.Value(0);
    return react_native_1.Animated.parallel([
        react_native_1.Animated.timing(opacityValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }),
        react_native_1.Animated.timing(scaleValue, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
        }),
        react_native_1.Animated.timing(rotationValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
    ]);
};
exports.createTreeDeathAnimation = createTreeDeathAnimation;
var createTreeReviveAnimation = function () {
    var scaleValue = new react_native_1.Animated.Value(0.2);
    var opacityValue = new react_native_1.Animated.Value(0);
    return react_native_1.Animated.sequence([
        react_native_1.Animated.timing(scaleValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }),
        react_native_1.Animated.timing(opacityValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }),
    ]);
};
exports.createTreeReviveAnimation = createTreeReviveAnimation;
var getTreeColor = function (treeType, alive) {
    if (!alive)
        return '#8B7355'; // Brown for dead trees
    var colors = {
        oak: '#4A6741',
        pine: '#2D5016',
        cherry: '#FFB7C5',
        willow: '#90EE90',
        maple: '#FF8C00',
    };
    return colors[treeType] || '#4A6741';
};
exports.getTreeColor = getTreeColor;
var getTreeTrunkColor = function (treeType) {
    var colors = {
        oak: '#8B4513',
        pine: '#654321',
        cherry: '#A0522D',
        willow: '#8B7355',
        maple: '#8B4513',
    };
    return colors[treeType] || '#8B4513';
};
exports.getTreeTrunkColor = getTreeTrunkColor;
var calculateFocusScore = function (studyTime, targetTime, treeSurvived) {
    // Base score from time spent
    var timeScore = Math.min((studyTime / targetTime) * 60, 60);
    // Bonus for tree survival
    var treeBonus = treeSurvived ? 40 : 0;
    // Calculate total score (0-100)
    var totalScore = Math.round(timeScore + treeBonus);
    return Math.min(totalScore, 100);
};
exports.calculateFocusScore = calculateFocusScore;
var getFocusScoreLabel = function (score) {
    if (score >= 90)
        return 'Excellent! 🌟';
    if (score >= 70)
        return 'Great job! 👏';
    if (score >= 50)
        return 'Good focus! 👍';
    if (score >= 30)
        return 'Keep going! 💪';
    return 'Start fresh! 🌱';
};
exports.getFocusScoreLabel = getFocusScoreLabel;
var getFocusScoreColor = function (score) {
    if (score >= 90)
        return '#4CAF50'; // Green
    if (score >= 70)
        return '#8BC34A'; // Light green
    if (score >= 50)
        return '#FFC107'; // Yellow
    if (score >= 30)
        return '#FF9800'; // Orange
    return '#F44336'; // Red
};
exports.getFocusScoreColor = getFocusScoreColor;
