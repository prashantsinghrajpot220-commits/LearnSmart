"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
var colors_1 = require("../constants/colors");
var spacing_1 = require("../constants/spacing");
exports.Theme = {
    colors: colors_1.Colors,
    spacing: spacing_1.Spacing,
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
    typography: {
        sizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
            xxl: 32,
            xxxl: 40,
        },
        weights: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },
    shadows: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
    },
};
exports.default = exports.Theme;
