"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontWeights = exports.FontSizes = exports.BorderRadius = exports.Spacing = exports.Colors = void 0;
var colors_1 = require("./colors");
var spacing_1 = require("./spacing");
exports.Colors = colors_1.Colors;
exports.Spacing = spacing_1.Spacing;
exports.BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};
exports.FontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 28,
    xxl: 32,
    xxxl: 40,
};
exports.FontWeights = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};
