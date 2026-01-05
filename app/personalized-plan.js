"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersonalizedPlanPage;
var react_1 = require("react");
var react_native_1 = require("react-native");
var PersonalizedPlanScreen_1 = require("@/screens/PersonalizedPlanScreen");
var ThemeContext_1 = require("@/components/ThemeContext");
function PersonalizedPlanPage() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      <PersonalizedPlanScreen_1.default />
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
