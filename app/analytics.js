"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsPage;
var react_1 = require("react");
var react_native_1 = require("react-native");
var AnalyticsScreen_1 = require("@/screens/AnalyticsScreen");
var ThemeContext_1 = require("@/components/ThemeContext");
function AnalyticsPage() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnalyticsScreen_1.default />
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
