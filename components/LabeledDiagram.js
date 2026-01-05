"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabeledDiagram = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var LabeledDiagram = function (_a) {
    var data = _a.data;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _b = (0, react_1.useState)(null), selectedLabel = _b[0], setSelectedLabel = _b[1];
    // Animation values
    var moveAnim = (0, react_native_reanimated_1.useSharedValue)(0);
    var pulseAnim = (0, react_native_reanimated_1.useSharedValue)(1);
    var rotationAnim = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(function () {
        if (data.animationType === 'motion') {
            moveAnim.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1, { duration: 2000, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }), (0, react_native_reanimated_1.withTiming)(0, { duration: 2000, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) })), -1);
        }
        else if (data.animationType === 'pulse' || data.animationType === 'molecular') {
            pulseAnim.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1.1, { duration: 1000 }), (0, react_native_reanimated_1.withTiming)(1, { duration: 1000 })), -1);
        }
        else if (data.type === 'pendulum' || data.type === 'physics') {
            rotationAnim.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(30, { duration: 1500, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }), (0, react_native_reanimated_1.withTiming)(-30, { duration: 1500, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) })), -1);
        }
    }, [data.animationType, data.type]);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        if (data.animationType === 'motion') {
            return {
                transform: [{ translateX: moveAnim.value * 100 - 50 }],
            };
        }
        if (data.animationType === 'pulse' || data.animationType === 'molecular') {
            return {
                transform: [{ scale: pulseAnim.value }],
            };
        }
        return {};
    });
    var pendulumStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            transform: [
                { translateY: -40 },
                { rotate: "".concat(rotationAnim.value, "deg") },
                { translateY: 40 }
            ],
        };
    });
    var renderVisual = function () {
        switch (data.type) {
            case 'pendulum':
                return (<react_native_1.View style={styles.visualContainer}>
            <react_native_1.View style={styles.support}/>
            <react_native_reanimated_1.default.View style={[styles.pendulumRod, pendulumStyle]}>
              <react_native_1.View style={[styles.pendulumBob, { backgroundColor: colors.primary }]}/>
            </react_native_reanimated_1.default.View>
          </react_native_1.View>);
            case 'motion':
                return (<react_native_1.View style={styles.visualContainer}>
            <react_native_1.View style={styles.road}/>
            <react_native_reanimated_1.default.View style={[styles.object, animatedStyle, { backgroundColor: colors.primary }]}>
              <vector_icons_1.Feather name="truck" size={24} color="white"/>
            </react_native_reanimated_1.default.View>
          </react_native_1.View>);
            case 'physics':
                return (<react_native_1.View style={styles.visualContainer}>
            <react_native_reanimated_1.default.View style={[styles.object, animatedStyle, { backgroundColor: colors.primary }]}>
              <vector_icons_1.Feather name="box" size={32} color="white"/>
            </react_native_reanimated_1.default.View>
          </react_native_1.View>);
            case 'chemistry':
            case 'atomic':
                return (<react_native_1.View style={styles.visualContainer}>
            <react_native_reanimated_1.default.View style={[styles.atom, animatedStyle, { backgroundColor: colors.primary }]}>
              <react_native_1.View style={styles.nucleus}/>
            </react_native_reanimated_1.default.View>
          </react_native_1.View>);
            case 'biology':
                return (<react_native_1.View style={styles.visualContainer}>
            <react_native_reanimated_1.default.View style={[styles.cell, animatedStyle, { borderColor: colors.primary }]}>
              <react_native_1.View style={[styles.nucleus, { backgroundColor: colors.primary }]}/>
            </react_native_reanimated_1.default.View>
          </react_native_1.View>);
            default:
                return (<react_native_1.View style={styles.visualContainer}>
            <vector_icons_1.Feather name="image" size={48} color={colors.textSecondary}/>
          </react_native_1.View>);
        }
    };
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <react_native_1.Text style={[styles.title, { color: colors.text }]}>
        {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Diagram
      </react_native_1.Text>
      
      <react_native_1.View style={[styles.diagramArea, { backgroundColor: colors.background }]}>
        {renderVisual()}
        
        {data.labels.map(function (label, index) { return (<react_native_1.View key={index} style={[styles.labelWrapper, { left: "".concat(label.x, "%"), top: "".concat(label.y, "%") }]}>
            <react_native_1.TouchableOpacity style={[styles.labelDot, { backgroundColor: colors.primary }]} onPress={function () { return setSelectedLabel(selectedLabel === label.text ? null : label.text); }} activeOpacity={0.7}>
              <vector_icons_1.Feather name="info" size={12} color="white"/>
            </react_native_1.TouchableOpacity>
            
            {selectedLabel === label.text && (<react_native_1.View style={[styles.tooltip, { backgroundColor: colors.charcoal }]}>
                <react_native_1.Text style={styles.tooltipTitle}>{label.text}</react_native_1.Text>
                <react_native_1.Text style={styles.tooltipText}>{label.tooltip}</react_native_1.Text>
                <react_native_1.TouchableOpacity style={styles.closeTooltip} onPress={function () { return setSelectedLabel(null); }}>
                  <vector_icons_1.Feather name="x" size={12} color="white"/>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>)}
          </react_native_1.View>); })}
      </react_native_1.View>
      
      <react_native_1.Text style={[styles.hint, { color: colors.textSecondary }]}>
        Tap the info icons to explore details
      </react_native_1.Text>
    </react_native_1.View>);
};
exports.LabeledDiagram = LabeledDiagram;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginVertical: theme_1.Spacing.xl,
        padding: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.xl,
        borderWidth: 1,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: 'bold',
        marginBottom: theme_1.Spacing.md,
        textAlign: 'center',
    },
    diagramArea: {
        height: 220,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme_1.BorderRadius.lg,
        overflow: 'hidden',
    },
    visualContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    support: {
        width: 60,
        height: 4,
        backgroundColor: '#333',
        position: 'absolute',
        top: 40,
    },
    pendulumRod: {
        width: 2,
        height: 100,
        backgroundColor: '#666',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    pendulumBob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginBottom: -10,
    },
    road: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        height: 2,
        backgroundColor: '#ccc',
        borderStyle: 'dashed',
    },
    object: {
        width: 50,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    atom: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        width: 100,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nucleus: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    labelWrapper: {
        position: 'absolute',
        zIndex: 100,
    },
    labelDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    tooltip: {
        position: 'absolute',
        bottom: 30,
        left: -75,
        width: 150,
        padding: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        zIndex: 200,
        elevation: 10,
    },
    tooltipTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: theme_1.FontSizes.sm,
        marginBottom: 4,
    },
    tooltipText: {
        color: '#eee',
        fontSize: 12,
        lineHeight: 16,
    },
    closeTooltip: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 2,
    },
    hint: {
        marginTop: theme_1.Spacing.md,
        fontSize: theme_1.FontSizes.xs,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
