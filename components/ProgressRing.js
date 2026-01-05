"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressRing = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("./ThemeContext");
var ProgressRing = function (_a) {
    var progress = _a.progress, _b = _a.size, size = _b === void 0 ? 60 : _b, _c = _a.strokeWidth, strokeWidth = _c === void 0 ? 6 : _c, _d = _a.showText, showText = _d === void 0 ? true : _d;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    // Fallback to a circular progress bar using Views if SVG is not available
    // Here we use a simpler circular indicator
    return (<react_native_1.View style={[styles.container, { width: size, height: size }]}>
      <react_native_1.View style={[
            styles.outerCircle,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: colors.border,
            }
        ]}>
        {/* Simple representation: color intensity or just a text for now if complex circles are not possible */}
        <react_native_1.View style={styles.textContainer}>
          {showText && (<react_native_1.Text style={[styles.text, { color: colors.primary, fontSize: size * 0.25 }]}>
              {Math.round(progress)}%
            </react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.View>
      {/* Small indicator of progress */}
      <react_native_1.View style={[
            styles.indicator,
            {
                borderColor: colors.primary,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderTopColor: colors.primary,
                borderRightColor: progress >= 25 ? colors.primary : 'transparent',
                borderBottomColor: progress >= 50 ? colors.primary : 'transparent',
                borderLeftColor: progress >= 75 ? colors.primary : 'transparent',
                position: 'absolute',
                transform: [{ rotate: '45deg' }]
            }
        ]}/>
    </react_native_1.View>);
};
exports.ProgressRing = ProgressRing;
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        backgroundColor: 'transparent',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '700',
    },
});
exports.default = exports.ProgressRing;
