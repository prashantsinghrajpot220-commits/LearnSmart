"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var SmartyChat_1 = require("@/components/SmartyChat");
var ThemeContext_1 = require("@/components/ThemeContext");
var expo_router_1 = require("expo-router");
function ChatScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.View style={styles.chatWrapper}>
        <SmartyChat_1.default onClose={function () { return router.back(); }} fullScreen={true}/>
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    chatWrapper: {
        flex: 1,
        // When used as a screen, we want it to take full space
        // We might need to adjust SmartyChat styles if they are absolute
    }
});
