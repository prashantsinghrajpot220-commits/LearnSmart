"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VoiceNotesPage;
var react_1 = require("react");
var react_native_1 = require("react-native");
var VoiceNotesScreen_1 = require("@/screens/VoiceNotesScreen");
var ThemeContext_1 = require("@/components/ThemeContext");
function VoiceNotesPage() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoiceNotesScreen_1.default />
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
