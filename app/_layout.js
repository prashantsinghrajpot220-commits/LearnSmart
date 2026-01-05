"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var expo_status_bar_1 = require("expo-status-bar");
var react_native_1 = require("react-native");
var googleAds_1 = require("@/utils/googleAds");
var ThemeContext_1 = require("../components/ThemeContext");
var ChatContext_1 = require("../context/ChatContext");
var SmartyChat_1 = require("../components/SmartyChat");
var chatStore_1 = require("../store/chatStore");
var networkService_1 = require("../services/networkService");
var streakService_1 = require("../services/streakService");
var xpStore_1 = require("../store/xpStore");
var achievementStore_1 = require("../store/achievementStore");
var BottomTabNavigator_1 = require("../components/BottomTabNavigator");
var HeaderComponent_1 = require("../components/HeaderComponent");
var FloatingActionButton_1 = require("../components/FloatingActionButton");
var expo_router_2 = require("expo-router");
var ErrorBoundary_1 = require("../components/ErrorBoundary");
var AnalyticsService_1 = require("@/services/AnalyticsService");
var MistakeAnalysisService_1 = require("@/services/MistakeAnalysisService");
var voiceNoteStore_1 = require("@/store/voiceNoteStore");
var notificationStore_1 = require("@/store/notificationStore");
var SocialNotificationBanner_1 = require("@/components/SocialNotificationBanner");
function RootLayoutContent() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var _b = (0, chatStore_1.useChatStore)(), isChatOpen = _b.isChatOpen, closeChat = _b.closeChat, toggleChat = _b.toggleChat;
    var _c = (0, react_1.useState)(false), isLoaded = _c[0], setIsLoaded = _c[1];
    var pathname = (0, expo_router_2.usePathname)();
    var loadXP = (0, xpStore_1.useXPStore)().loadXP;
    var loadAchievements = (0, achievementStore_1.useAchievementStore)().loadAchievements;
    var loadNotes = (0, voiceNoteStore_1.useVoiceNoteStore)().loadNotes;
    var notifications = (0, notificationStore_1.useNotificationStore)(function (s) { return s.notifications; });
    var activeNotificationId = (0, notificationStore_1.useNotificationStore)(function (s) { return s.activeNotificationId; });
    var dismissActive = (0, notificationStore_1.useNotificationStore)(function (s) { return s.dismissActive; });
    var activeNotification = (0, react_1.useMemo)(function () { var _a; return (_a = notifications.find(function (n) { return n.id === activeNotificationId; })) !== null && _a !== void 0 ? _a : null; }, [activeNotificationId, notifications]);
    (0, react_1.useEffect)(function () {
        // Initialize AdMob
        if (react_native_1.Platform.OS !== 'web') {
            (0, googleAds_1.default)()
                .initialize()
                .then(function () {
                console.log('AdMob initialized');
            })
                .catch(function (err) {
                console.warn('AdMob initialization failed:', err);
            });
        }
        // Initialize network listener
        (0, networkService_1.initializeNetworkListener)();
        // Initialize gamification services
        var initializeGamification = function () { return __awaiter(_this, void 0, void 0, function () {
            var streakResult, checkAndUnlock, _a, getXP, totalLessonsRead, totalQuizzesCompleted, error_1, timer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        // Load XP and achievements
                        return [4 /*yield*/, loadXP()];
                    case 1:
                        // Load XP and achievements
                        _b.sent();
                        return [4 /*yield*/, loadAchievements()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loadNotes()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, notificationStore_1.useNotificationStore.getState().loadNotifications()];
                    case 4:
                        _b.sent();
                        // Initialize and check streak
                        return [4 /*yield*/, streakService_1.streakService.initialize()];
                    case 5:
                        // Initialize and check streak
                        _b.sent();
                        return [4 /*yield*/, streakService_1.streakService.checkAndUpdateStreak()];
                    case 6:
                        streakResult = _b.sent();
                        // Initialize analytics and mistake tracking
                        return [4 /*yield*/, AnalyticsService_1.analyticsService.initialize()];
                    case 7:
                        // Initialize analytics and mistake tracking
                        _b.sent();
                        return [4 /*yield*/, MistakeAnalysisService_1.mistakeAnalysisService.initialize()];
                    case 8:
                        _b.sent();
                        checkAndUnlock = achievementStore_1.useAchievementStore.getState().checkAndUnlock;
                        _a = xpStore_1.useXPStore.getState(), getXP = _a.getXP, totalLessonsRead = _a.totalLessonsRead, totalQuizzesCompleted = _a.totalQuizzesCompleted;
                        checkAndUnlock({
                            currentStreak: streakResult.streak,
                            totalQuizzesCompleted: totalQuizzesCompleted,
                            totalLessonsRead: totalLessonsRead,
                            currentXP: getXP(),
                            rank: xpStore_1.useXPStore.getState().getRank().name,
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _b.sent();
                        console.error('Failed to initialize gamification:', error_1);
                        return [3 /*break*/, 10];
                    case 10:
                        timer = setTimeout(function () {
                            setIsLoaded(true);
                        }, 100);
                        return [2 /*return*/, function () {
                                clearTimeout(timer);
                            }];
                }
            });
        }); };
        initializeGamification();
        return function () {
            (0, networkService_1.cleanupNetworkListener)();
        };
    }, [loadXP, loadAchievements]);
    var showFloatingChat = !['/chat', '/auth', '/'].includes(pathname);
    if (!isLoaded) {
        return (<>
        <expo_status_bar_1.StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background}/>
        <expo_router_1.Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}>
          <expo_router_1.Stack.Screen name="index"/>
          <expo_router_1.Stack.Screen name="auth"/>
          <expo_router_1.Stack.Screen name="home"/>
          <expo_router_1.Stack.Screen name="home-12plus"/>
          <expo_router_1.Stack.Screen name="chapters"/>
          <expo_router_1.Stack.Screen name="lesson"/>
          <expo_router_1.Stack.Screen name="trophy-room"/>
          <expo_router_1.Stack.Screen name="profile"/>
          <expo_router_1.Stack.Screen name="explore"/>
          <expo_router_1.Stack.Screen name="chat"/>
          <expo_router_1.Stack.Screen name="community"/>
          <expo_router_1.Stack.Screen name="group/[groupId]"/>
          <expo_router_1.Stack.Screen name="qa-forum"/>
          <expo_router_1.Stack.Screen name="question-detail"/>
        </expo_router_1.Stack>
      </>);
    }
    return (<>
      <expo_status_bar_1.StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background}/>
      {activeNotification ? (<SocialNotificationBanner_1.default notification={activeNotification} onDismiss={function () {
                dismissActive();
            }}/>) : null}
      <HeaderComponent_1.HeaderComponent />
      <expo_router_1.Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
        }}>
        <expo_router_1.Stack.Screen name="index"/>
        <expo_router_1.Stack.Screen name="auth"/>
        <expo_router_1.Stack.Screen name="home"/>
        <expo_router_1.Stack.Screen name="home-12plus"/>
        <expo_router_1.Stack.Screen name="chapters"/>
        <expo_router_1.Stack.Screen name="lesson"/>
        <expo_router_1.Stack.Screen name="trophy-room"/>
        <expo_router_1.Stack.Screen name="profile"/>
        <expo_router_1.Stack.Screen name="explore"/>
        <expo_router_1.Stack.Screen name="chat"/>
        <expo_router_1.Stack.Screen name="community"/>
        <expo_router_1.Stack.Screen name="group/[groupId]"/>
        <expo_router_1.Stack.Screen name="qa-forum" options={{
            headerShown: true,
            title: 'Q&A Forum',
        }}/>
        <expo_router_1.Stack.Screen name="notifications" options={{
            headerShown: true,
            title: 'Notifications',
        }}/>
        <expo_router_1.Stack.Screen name="question-detail" options={{
            headerShown: true,
            title: 'Question',
        }}/>
        <expo_router_1.Stack.Screen name="privacy-policy"/>
        <expo_router_1.Stack.Screen name="terms"/>
        <expo_router_1.Stack.Screen name="about"/>
        <expo_router_1.Stack.Screen name="weak-areas" options={{
            headerShown: true,
            title: 'Weak Areas',
        }}/>
        <expo_router_1.Stack.Screen name="personalized-plan" options={{
            headerShown: true,
            title: 'Study Plan',
        }}/>
        <expo_router_1.Stack.Screen name="voice-notes" options={{
            headerShown: true,
            title: 'Voice Notes',
        }}/>
        <expo_router_1.Stack.Screen name="analytics" options={{
            headerShown: true,
            title: 'Analytics',
        }}/>
        <expo_router_1.Stack.Screen name="coin-history" options={{
            headerShown: true,
            title: 'SmartCoin History',
        }}/>
      </expo_router_1.Stack>
      <BottomTabNavigator_1.BottomTabNavigator />
      {showFloatingChat && <FloatingActionButton_1.FloatingActionButton onPress={toggleChat}/>}
      {isChatOpen && <SmartyChat_1.default onClose={closeChat}/>}
    </>);
}
function RootLayout() {
    return (<ThemeContext_1.ThemeProvider>
      <ChatContext_1.SmartyChatProvider>
        <ErrorBoundary_1.default>
          <RootLayoutContent />
        </ErrorBoundary_1.default>
      </ChatContext_1.SmartyChatProvider>
    </ThemeContext_1.ThemeProvider>);
}
