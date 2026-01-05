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
exports.default = ProfileScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("../components/ThemeContext");
var userStore_1 = require("@/store/userStore");
var xpStore_1 = require("@/store/xpStore");
var streakService_1 = require("@/services/streakService");
var ReputationService_1 = require("@/services/ReputationService");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var AvatarSelector_1 = require("../components/AvatarSelector");
var Dropdown_1 = require("../components/Dropdown");
var SmartCoinDisplay_1 = require("../components/SmartCoinDisplay");
var StreakCounter_1 = require("../components/StreakCounter");
var RankBadge_1 = require("../components/RankBadge");
var ReputationCard_1 = require("../components/ReputationCard");
var BadgeProgress_1 = require("../components/BadgeProgress");
var NotificationBadge_1 = require("../components/NotificationBadge");
function ProfileScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark, toggleTheme = _a.toggleTheme;
    var _b = (0, userStore_1.useUserStore)(), userName = _b.userName, setUserName = _b.setUserName, selectedClass = _b.selectedClass, setSelectedClass = _b.setSelectedClass, selectedAvatar = _b.selectedAvatar, logout = _b.logout, gamificationData = _b.gamificationData, userQuestions = _b.userQuestions, userAnswers = _b.userAnswers, answerStreakCount = _b.answerStreakCount, notificationPreferences = _b.notificationPreferences, updateNotificationPreferences = _b.updateNotificationPreferences;
    var currentXP = (0, xpStore_1.useCurrentRank)().currentXP;
    var _c = (0, xpStore_1.useXPStore)(), totalLessonsRead = _c.totalLessonsRead, totalQuizzesCompleted = _c.totalQuizzesCompleted;
    var _d = react_1.default.useState(0), streak = _d[0], setStreak = _d[1];
    var _e = (0, react_1.useState)(userName), editingName = _e[0], setEditingName = _e[1];
    var router = (0, expo_router_1.useRouter)();
    react_1.default.useEffect(function () {
        var getStreak = function () { return __awaiter(_this, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, streakService_1.streakService.getStreak()];
                    case 1:
                        s = _a.sent();
                        setStreak(s);
                        return [2 /*return*/];
                }
            });
        }); };
        getStreak();
        ReputationService_1.reputationService.checkBadges();
    }, []);
    var handleSaveProfile = function () {
        setUserName(editingName);
        react_native_1.Alert.alert('Profile Updated', 'Your profile changes have been saved.');
    };
    var handleLogout = function () {
        react_native_1.Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: function () {
                    logout();
                    router.replace('/');
                },
            },
        ]);
    };
    var classes = Array.from({ length: 12 }, function (_, i) { return "Class ".concat(i + 1); }).concat(['12+']);
    var styles = getStyles(colors);
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <AvatarSelector_1.AvatarDisplay id={selectedAvatar} size={100} style={styles.avatarHeader}/>
          <react_native_1.View style={styles.headerText}>
            <react_native_1.Text style={[styles.userName, { color: colors.text }]}>{userName || 'Student'}</react_native_1.Text>
            <react_native_1.Text style={[styles.userClass, { color: colors.textSecondary }]}>{selectedClass}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.notificationButtonWrapper}>
            <react_native_1.TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.cardBackground }]} onPress={function () { return router.push('/notifications'); }}>
              <vector_icons_1.MaterialCommunityIcons name="bell-outline" size={24} color={colors.text}/>
            </react_native_1.TouchableOpacity>
            <NotificationBadge_1.default size={14} showCount={true}/>
          </react_native_1.View>
        </react_native_1.View>

        {/* Stats Grid */}
        <react_native_1.View style={styles.statsGrid}>
          <react_native_1.View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <StreakCounter_1.default size="medium" showLabel={false}/>
          </react_native_1.View>
          <react_native_1.View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <react_native_1.Text style={styles.statEmoji}>✨</react_native_1.Text>
            <react_native_1.Text style={[styles.statValue, { color: colors.text }]}>{currentXP}</react_native_1.Text>
            <react_native_1.Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total XP</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <SmartCoinDisplay_1.default size="small" showLabel={false}/>
          </react_native_1.View>
        </react_native_1.View>

        {/* Expanded Stats */}
        <react_native_1.View style={styles.expandedStats}>
          <react_native_1.View style={[styles.expandedStat, { backgroundColor: colors.cardBackground }]}>
            <SmartCoinDisplay_1.default size="large" showLabel={true}/>
          </react_native_1.View>
          <react_native_1.View style={[styles.expandedStat, { backgroundColor: colors.cardBackground }]}>
            <StreakCounter_1.default size="large" showLabel={true} streakCount={answerStreakCount}/>
          </react_native_1.View>
        </react_native_1.View>

        {/* Reputation & Badges */}
        <ReputationCard_1.default />

        {/* Badge Progress */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Badge Progression</react_native_1.Text>
          {gamificationData.achievementProgress.length > 0 ? (gamificationData.achievementProgress.map(function (progress) { return (<BadgeProgress_1.default key={progress.id} progress={progress}/>); })) : (<react_native_1.Text style={{ color: colors.textSecondary, fontSize: theme_1.FontSizes.sm }}>
              Start answering questions to see your progress!
            </react_native_1.Text>)}
        </react_native_1.View>

        {/* Weekly Progress & Rank */}
        <react_native_1.View style={styles.weeklySection}>
          <react_native_1.View style={[styles.weeklyCard, { backgroundColor: colors.cardBackground }]}>
            <react_native_1.View style={styles.weeklyHeader}>
              <react_native_1.Text style={[styles.weeklyTitle, { color: colors.text }]}>
                Weekly Progress
              </react_native_1.Text>
              <react_native_1.Text style={[styles.weeklySubtitle, { color: colors.textSecondary }]}>
                Resets Sunday at 12 AM
              </react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.weeklyStats}>
              <react_native_1.View style={styles.weeklyStat}>
                <react_native_1.Text style={[styles.weeklyStatValue, { color: '#B2AC88' }]}>
                  {gamificationData.weeklyXP}
                </react_native_1.Text>
                <react_native_1.Text style={[styles.weeklyStatLabel, { color: colors.textSecondary }]}>
                  Weekly XP
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.weeklyStat}>
                <RankBadge_1.default size="small"/>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.statsRow}>
           <react_native_1.View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <vector_icons_1.MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary}/>
              <react_native_1.Text style={[styles.miniStatText, { color: colors.text }]}>{totalLessonsRead} Lessons</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <vector_icons_1.MaterialCommunityIcons name="help-circle-outline" size={20} color={colors.primary}/>
              <react_native_1.Text style={[styles.miniStatText, { color: colors.text }]}>{totalQuizzesCompleted} Quizzes</react_native_1.Text>
           </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.statsRow}>
           <react_native_1.View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <vector_icons_1.MaterialCommunityIcons name="help-box" size={20} color={colors.primary}/>
              <react_native_1.Text style={[styles.miniStatText, { color: colors.text }]}>{userQuestions.length} Questions</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.View style={[styles.miniStat, { backgroundColor: colors.cardBackground }]}>
              <vector_icons_1.MaterialCommunityIcons name="comment-text-outline" size={20} color={colors.primary}/>
              <react_native_1.Text style={[styles.miniStatText, { color: colors.text }]}>{userAnswers.length} Answers</react_native_1.Text>
           </react_native_1.View>
        </react_native_1.View>

        {/* Gamification Actions */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Gamification</react_native_1.Text>
          
          <react_native_1.TouchableOpacity style={[styles.actionItem, { borderBottomColor: colors.lightGray }]} onPress={function () { return router.push('/leaderboard'); }}>
            <react_native_1.View style={styles.actionLabelGroup}>
              <vector_icons_1.MaterialCommunityIcons name="trophy" size={24} color={colors.primary}/>
              <react_native_1.View style={styles.actionTextContainer}>
                <react_native_1.Text style={[styles.actionLabel, { color: colors.text }]}>Leaderboard</react_native_1.Text>
                <react_native_1.Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                  See how you rank against others
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={[styles.actionItem, { borderBottomColor: colors.lightGray }]} onPress={function () { return router.push('/avatar-store'); }}>
            <react_native_1.View style={styles.actionLabelGroup}>
              <vector_icons_1.MaterialCommunityIcons name="store" size={24} color={colors.primary}/>
              <react_native_1.View style={styles.actionTextContainer}>
                <react_native_1.Text style={[styles.actionLabel, { color: colors.text }]}>Avatar Store</react_native_1.Text>
                <react_native_1.Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                  Unlock new avatars with SmartCoins
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.actionRightContainer}>
              <SmartCoinDisplay_1.default size="small" showLabel={false}/>
              <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={[styles.actionItem, { borderBottomColor: colors.lightGray }]} onPress={function () { return router.push('/coin-history'); }}>
            <react_native_1.View style={styles.actionLabelGroup}>
              <vector_icons_1.MaterialCommunityIcons name="history" size={24} color={colors.primary}/>
              <react_native_1.View style={styles.actionTextContainer}>
                <react_native_1.Text style={[styles.actionLabel, { color: colors.text }]}>Coin History</react_native_1.Text>
                <react_native_1.Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                  View your SmartCoin transactions
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* Edit Profile Section */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Edit Profile</react_native_1.Text>
          
          <react_native_1.View style={styles.inputGroup}>
            <react_native_1.Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Display Name</react_native_1.Text>
            <react_native_1.TextInput style={[styles.input, { color: colors.text, borderColor: colors.lightGray, backgroundColor: colors.cardBackground }]} value={editingName} onChangeText={setEditingName} placeholder="Enter your name" placeholderTextColor={colors.textSecondary}/>
          </react_native_1.View>

          <react_native_1.View style={styles.inputGroup}>
            <Dropdown_1.default label="Grade/Class" options={classes} value={selectedClass} onSelect={setSelectedClass} placeholder="Select Class"/>
          </react_native_1.View>

          <react_native_1.TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveProfile}>
            <react_native_1.Text style={styles.saveButtonText}>Save Changes</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* Avatar Selection */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Avatar</react_native_1.Text>
          <AvatarSelector_1.AvatarSelector />
        </react_native_1.View>

        {/* Settings Section */}
        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</react_native_1.Text>
          
          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
            <react_native_1.View style={styles.settingLabelGroup}>
              <vector_icons_1.Feather name={isDark ? "moon" : "sun"} size={20} color={colors.text}/>
              <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={isDark ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.TouchableOpacity style={styles.linkItem} onPress={function () { return router.push('/privacy-policy'); }}>
            <react_native_1.Text style={[styles.linkLabel, { color: colors.text }]}>Privacy Policy</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.linkItem} onPress={function () { return router.push('/terms'); }}>
            <react_native_1.Text style={[styles.linkLabel, { color: colors.text }]}>Terms of Service</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.linkItem} onPress={function () { return router.push('/about'); }}>
            <react_native_1.Text style={[styles.linkLabel, { color: colors.text }]}>About LearnSmart</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.linkItem} onPress={function () { return router.push('/analytics'); }}>
            <react_native_1.Text style={[styles.linkLabel, { color: colors.text }]}>Analytics</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.linkItem} onPress={function () { return router.push('/weak-areas'); }}>
           <react_native_1.Text style={[styles.linkLabel, { color: colors.text }]}>Weak Areas</react_native_1.Text>
           <vector_icons_1.Feather name="chevron-right" size={20} color={colors.textSecondary}/>
          </react_native_1.TouchableOpacity>
          </react_native_1.View>

          {/* Notification Preferences Section */}
          <react_native_1.View style={styles.section}>
          <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Preferences</react_native_1.Text>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="message-square" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Answers</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.answers} onValueChange={function (value) { return updateNotificationPreferences({ answers: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.answers ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="thumbs-up" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Upvotes</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.upvotes} onValueChange={function (value) { return updateNotificationPreferences({ upvotes: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.upvotes ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="star" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Helpful Marks</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.helpfulMarks} onValueChange={function (value) { return updateNotificationPreferences({ helpfulMarks: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.helpfulMarks ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="award" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Badge Unlocks</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.badgeUnlocks} onValueChange={function (value) { return updateNotificationPreferences({ badgeUnlocks: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.badgeUnlocks ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="bar-chart" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Leaderboard Updates</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.leaderboardUpdates} onValueChange={function (value) { return updateNotificationPreferences({ leaderboardUpdates: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.leaderboardUpdates ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>

          <react_native_1.View style={[styles.settingItem, { borderBottomColor: colors.lightGray }]}>
           <react_native_1.View style={styles.settingLabelGroup}>
             <vector_icons_1.Feather name="flag" size={20} color={colors.text}/>
             <react_native_1.Text style={[styles.settingLabel, { color: colors.text }]}>Milestones</react_native_1.Text>
           </react_native_1.View>
           <react_native_1.Switch value={notificationPreferences.milestones} onValueChange={function (value) { return updateNotificationPreferences({ milestones: value }); }} trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }} thumbColor={notificationPreferences.milestones ? colors.primary : '#F4F3F4'}/>
          </react_native_1.View>
          </react_native_1.View>

          <react_native_1.TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <vector_icons_1.Feather name="log-out" size={20} color={colors.error}/>
          <react_native_1.Text style={styles.logoutText}>Sign Out</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.View style={styles.spacer}/>
      </react_native_1.ScrollView>
    </react_native_1.SafeAreaView>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: theme_1.Spacing.lg,
        paddingTop: react_native_1.Platform.select({ ios: 60, default: 20 }), // Combined with SafeAreaView
        paddingBottom: 120,
    },
    header: {
        alignItems: 'center',
        marginVertical: theme_1.Spacing.xl,
    },
    headerText: {
        alignItems: 'center',
    },
    notificationButtonWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    notificationButton: __assign({ width: 44, height: 44, borderRadius: theme_1.BorderRadius.full, alignItems: 'center', justifyContent: 'center' }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: {
            elevation: 2,
        },
    })),
    avatarHeader: __assign({ marginBottom: theme_1.Spacing.md, borderWidth: 4, borderColor: '#FFFFFF' }, react_native_1.Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
        android: { elevation: 5 },
    })),
    userName: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
    },
    userClass: {
        fontSize: theme_1.FontSizes.md,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme_1.Spacing.lg,
    },
    expandedStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme_1.Spacing.lg,
    },
    expandedStat: __assign({ flex: 1, marginHorizontal: 5, padding: theme_1.Spacing.lg, borderRadius: theme_1.BorderRadius.lg, alignItems: 'center' }, react_native_1.Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
        android: { elevation: 2 },
    })),
    statCard: __assign({ flex: 1, marginHorizontal: 5, padding: theme_1.Spacing.md, borderRadius: theme_1.BorderRadius.lg, alignItems: 'center' }, react_native_1.Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
        android: { elevation: 2 },
    })),
    statEmoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    statValue: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
    },
    statLabel: {
        fontSize: 10,
        marginTop: 2,
        textAlign: 'center',
    },
    weeklySection: {
        marginBottom: theme_1.Spacing.lg,
    },
    weeklyCard: {
        padding: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
    },
    weeklyHeader: {
        marginBottom: theme_1.Spacing.md,
    },
    weeklyTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
    },
    weeklySubtitle: {
        fontSize: theme_1.FontSizes.sm,
        marginTop: 2,
    },
    weeklyStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weeklyStat: {
        alignItems: 'center',
    },
    weeklyStatValue: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
    },
    weeklyStatLabel: {
        fontSize: theme_1.FontSizes.sm,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme_1.Spacing.xl,
    },
    miniStat: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
    },
    miniStatText: {
        marginLeft: theme_1.Spacing.xs,
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme_1.Spacing.md,
        borderBottomWidth: 1,
    },
    actionLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionTextContainer: {
        marginLeft: theme_1.Spacing.md,
    },
    actionLabel: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.medium,
    },
    actionSublabel: {
        fontSize: theme_1.FontSizes.sm,
        marginTop: 2,
    },
    actionRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginBottom: theme_1.Spacing.xxl,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: theme_1.Spacing.md,
    },
    inputGroup: {
        marginBottom: theme_1.Spacing.md,
    },
    inputLabel: {
        fontSize: theme_1.FontSizes.sm,
        marginBottom: 5,
        marginLeft: 4,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: theme_1.BorderRadius.md,
        paddingHorizontal: theme_1.Spacing.md,
        fontSize: theme_1.FontSizes.md,
    },
    saveButton: {
        height: 50,
        borderRadius: theme_1.BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.sm,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme_1.Spacing.md,
        borderBottomWidth: 1,
    },
    settingLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: theme_1.FontSizes.md,
        marginLeft: theme_1.Spacing.md,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme_1.Spacing.md,
    },
    linkLabel: {
        fontSize: theme_1.FontSizes.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.md,
        marginTop: theme_1.Spacing.lg,
    },
    logoutText: {
        color: colors.error,
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
        marginLeft: theme_1.Spacing.sm,
    },
    spacer: {
        height: 40,
    }
}); };
