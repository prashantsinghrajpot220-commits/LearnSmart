"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WeakAreasPage;
var react_1 = require("react");
var react_native_1 = require("react-native");
var WeakAreasScreen_1 = require("@/screens/WeakAreasScreen");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/ThemeContext");
function WeakAreasPage() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      <WeakAreasScreen_1.default />
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
