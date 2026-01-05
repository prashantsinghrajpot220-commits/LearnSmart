"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbNav = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var BreadcrumbNav = function (_a) {
    var paths = _a.paths;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {paths.map(function (item, index) {
            var isLast = index === paths.length - 1;
            return (<react_1.default.Fragment key={index}>
              <react_native_1.TouchableOpacity onPress={function () { return !isLast && router.push(item.path); }} disabled={isLast}>
                <react_native_1.Text style={[
                    styles.label,
                    { color: isLast ? colors.primary : colors.textSecondary },
                    isLast && styles.activeLabel
                ]}>
                  {item.label}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>
              {!isLast && (<vector_icons_1.MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSecondary} style={styles.separator}/>)}
            </react_1.default.Fragment>);
        })}
      </react_native_1.ScrollView>
    </react_native_1.View>);
};
exports.BreadcrumbNav = BreadcrumbNav;
var styles = react_native_1.StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    scrollContent: {
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '400',
    },
    activeLabel: {
        fontWeight: '600',
    },
    separator: {
        marginHorizontal: 4,
    },
});
exports.default = exports.BreadcrumbNav;
