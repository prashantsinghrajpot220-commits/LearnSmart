"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderComponent = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var HeaderComponent = function () {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    var pathname = (0, expo_router_1.usePathname)();
    // Don't show header on some screens
    var hideOnScreens = ['/', '/auth', '/welcome', '/login', '/signup'];
    if (hideOnScreens.some(function (screen) { return pathname === screen || pathname.startsWith('/auth/'); })) {
        return null;
    }
    var getPageTitle = function (path) {
        if (path === '/home' || path === '/home-12plus')
            return 'Dashboard';
        if (path === '/explore')
            return 'Explore';
        if (path === '/chat')
            return 'Smarty AI';
        if (path === '/community' || path.startsWith('/group/'))
            return 'Community';
        if (path === '/profile')
            return 'Profile';
        if (path.startsWith('/lesson'))
            return 'Lesson';
        if (path.startsWith('/chapters'))
            return 'Chapters';
        return 'LearnSmart';
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[
            styles.headerContent,
            {
                backgroundColor: colors.glass,
                borderBottomColor: colors.border
            }
        ]}>
        <react_native_1.View style={styles.leftSection}>
          {router.canGoBack() && !['/home', '/explore', '/chat', '/profile'].includes(pathname) ? (<react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
              <vector_icons_1.MaterialCommunityIcons name="arrow-left" size={24} color={colors.text}/>
            </react_native_1.TouchableOpacity>) : (<react_native_1.TouchableOpacity onPress={function () { return router.push('/home'); }}>
              <react_native_1.Image source={require('@/assets/icon.png')} style={styles.logo}/>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>

        <react_native_1.View style={styles.centerSection}>
          <react_native_1.Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {getPageTitle(pathname)}
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.rightSection}>
          <react_native_1.TouchableOpacity style={styles.iconButton}>
            <vector_icons_1.MaterialCommunityIcons name="bell-outline" size={24} color={colors.text}/>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.avatarContainer} onPress={function () { return router.push('/profile'); }}>
            <react_native_1.Image source={{ uri: 'https://ui-avatars.com/api/?name=User&background=9CAF88&color=fff' }} style={styles.avatar}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.HeaderComponent = HeaderComponent;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: react_native_1.Platform.OS === 'ios' ? 44 : 0,
    },
    headerContent: __assign({ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 }, react_native_1.Platform.select({
        web: {
            backdropFilter: 'blur(10px)',
        }
    })),
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        marginRight: 12,
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
});
exports.default = exports.HeaderComponent;
