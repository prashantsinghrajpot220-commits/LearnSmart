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
exports.BottomTabNavigator = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var expo_router_1 = require("expo-router");
var react_native_reanimated_1 = require("react-native-reanimated");
var NotificationBadge_1 = require("./NotificationBadge");
var width = react_native_1.Dimensions.get('window').width;
var TAB_BAR_WIDTH = width - 32;
var TABS = [
    { name: 'Home', icon: 'home-variant', path: '/home' },
    { name: 'Plan', icon: 'book-open-variant', path: '/personalized-plan' },
    { name: 'Forum', icon: 'forum', path: '/qa-forum' },
    { name: 'Chat', icon: 'message-bubble', path: '/chat' },
    { name: 'Community', icon: 'account-group', path: '/community' },
    { name: 'Notes', icon: 'microphone', path: '/voice-notes' },
    { name: 'Profile', icon: 'account', path: '/profile', hasBadge: true },
];
var TAB_WIDTH = TAB_BAR_WIDTH / TABS.length;
var BottomTabNavigator = function () {
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var router = (0, expo_router_1.useRouter)();
    var pathname = (0, expo_router_1.usePathname)();
    var translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(function () {
        var activeIndex = TABS.findIndex(function (tab) {
            var isHome = tab.path === '/home' && (pathname === '/home' || pathname === '/home-12plus');
            var isCommunity = tab.path === '/community' && (pathname === '/community' || pathname.startsWith('/group/'));
            var isForum = tab.path === '/qa-forum' && (pathname === '/qa-forum' || pathname.startsWith('/question-detail'));
            return pathname === tab.path || isHome || isCommunity || isForum;
        });
        if (activeIndex !== -1) {
            translateX.value = (0, react_native_reanimated_1.withSpring)(activeIndex * TAB_WIDTH, {
                damping: 15,
                stiffness: 100
            });
        }
    }, [pathname, translateX]);
    var indicatorStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });
    var handlePress = function (path) {
        router.push(path);
    };
    var hideOnScreens = ['/', '/auth', '/lesson', '/chapters', '/welcome', '/login', '/signup'];
    if (hideOnScreens.some(function (screen) { return pathname === screen || pathname.startsWith('/lesson/') || pathname.startsWith('/auth/'); })) {
        return null;
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[
            styles.tabBar,
            {
                backgroundColor: colors.glass,
                borderColor: colors.border,
            }
        ]}>
        <react_native_reanimated_1.default.View style={[
            styles.activeIndicator,
            {
                backgroundColor: colors.primary,
                width: TAB_WIDTH - 20,
                left: 10,
            },
            indicatorStyle
        ]}/>
        
        {TABS.map(function (tab) {
            var isHome = tab.path === '/home' && (pathname === '/home' || pathname === '/home-12plus');
            var isCommunity = tab.path === '/community' && (pathname === '/community' || pathname.startsWith('/group/'));
            var isForum = tab.path === '/qa-forum' && (pathname === '/qa-forum' || pathname.startsWith('/question-detail'));
            var isActive = pathname === tab.path || isHome || isCommunity || isForum;
            return (<react_native_1.TouchableOpacity key={tab.name} style={styles.tabItem} onPress={function () { return handlePress(tab.path); }} activeOpacity={0.7}>
              <react_native_1.View style={styles.iconContainer}>
                <vector_icons_1.MaterialCommunityIcons name={tab.icon} size={24} color={isActive ? colors.white : colors.textSecondary}/>
                {tab.hasBadge && <NotificationBadge_1.default size={18} showCount={false}/>}
              </react_native_1.View>
              <react_native_1.Text style={[
                    styles.tabLabel,
                    { color: isActive ? colors.white : colors.textSecondary }
                ]}>
                {tab.name}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>);
        })}
      </react_native_1.View>
    </react_native_1.View>);
};
exports.BottomTabNavigator = BottomTabNavigator;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: react_native_1.Platform.OS === 'ios' ? 30 : 20,
        left: 16,
        right: 16,
        alignItems: 'center',
        zIndex: 1000,
    },
    tabBar: __assign({ flexDirection: 'row', width: '100%', height: 70, borderRadius: 35, overflow: 'hidden', paddingHorizontal: 0, borderWidth: 1 }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
        },
        android: {
            elevation: 10,
        },
        web: {
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
        }
    })),
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    iconContainer: {
        position: 'relative',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
    },
    activeIndicator: {
        position: 'absolute',
        height: 50,
        top: 10,
        borderRadius: 25,
        zIndex: 0,
    }
});
exports.default = exports.BottomTabNavigator;
