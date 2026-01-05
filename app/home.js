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
exports.default = Home;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var userStore_1 = require("@/store/userStore");
var AvatarSelector_1 = require("@/components/AvatarSelector");
var curriculum_1 = require("@/constants/curriculum");
var ThemeContext_1 = require("@/components/ThemeContext");
var ChatContext_1 = require("@/context/ChatContext");
var XPBar_1 = require("@/components/XPBar");
var ProgressRing_1 = require("@/components/ProgressRing");
var StreakBadge_1 = require("@/components/StreakBadge");
var ExamCountdownWidget_1 = require("@/components/ExamCountdownWidget");
var streakService_1 = require("@/services/streakService");
var xpStore_1 = require("@/store/xpStore");
var achievementStore_1 = require("@/store/achievementStore");
var vector_icons_1 = require("@expo/vector-icons");
function Home() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var _a = (0, userStore_1.useUserStore)(), userName = _a.userName, selectedClass = _a.selectedClass, ageGroup = _a.ageGroup, logout = _a.logout, loadUserData = _a.loadUserData, selectedAvatar = _a.selectedAvatar;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var setCurrentContext = (0, ChatContext_1.useSmartyContext)().setCurrentContext;
    var loadXP = (0, xpStore_1.useXPStore)().loadXP;
    var loadAchievements = (0, achievementStore_1.useAchievementStore)().loadAchievements;
    var _b = (0, react_1.useState)(0), streak = _b[0], setStreak = _b[1];
    var opacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    (0, react_1.useEffect)(function () {
        loadUserData();
        loadXP();
        loadAchievements();
        setCurrentContext(undefined, undefined, undefined);
        // Load streak
        var loadStreak = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentStreak;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, streakService_1.streakService.getStreak()];
                    case 1:
                        currentStreak = _a.sent();
                        setStreak(currentStreak);
                        return [2 /*return*/];
                }
            });
        }); };
        loadStreak();
        // Fade in animation
        react_native_1.Animated.timing(opacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [loadUserData, setCurrentContext, loadXP, loadAchievements, opacity]);
    (0, react_1.useEffect)(function () {
        if (ageGroup === '12plus') {
            router.replace('/home-12plus');
        }
    }, [ageGroup, router]);
    var subjects = selectedClass ? (0, curriculum_1.getSubjectsForClass)(selectedClass) : [];
    var classNum = selectedClass ? parseInt(selectedClass.replace('Class ', '')) : 0;
    var handleSubjectPress = function (subject) {
        if (subject.includes('Coming Soon')) {
            return;
        }
        router.push({
            pathname: '/chapters',
            params: { subject: subject, class: selectedClass },
        });
    };
    var handleLogout = function () {
        logout();
        router.replace('/');
    };
    var handleProfilePress = function () {
        router.push('/profile');
    };
    var displayName = userName || 'Student';
    var styles = getStyles(colors);
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <react_native_1.Animated.View style={[styles.content, { opacity: opacity }]}> 
        <react_native_1.View style={styles.header}>
          <react_native_1.View style={styles.headerTop}>
            <react_native_1.View style={{ flex: 1 }}>
              <react_native_1.Text style={styles.title}>Welcome, {displayName}!</react_native_1.Text>
              <react_native_1.View style={styles.classBadge}>
                <react_native_1.Text style={styles.classText}>{selectedClass || 'No Class Selected'}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <AvatarSelector_1.AvatarDisplay id={selectedAvatar} size={60}/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        {/* Gamification Section */}
        <react_native_1.View style={styles.gamificationSection}>
          <react_native_1.View style={styles.gamificationRow}>
            <react_native_1.View style={styles.xpBarContainer}>
              <XPBar_1.XPBar currentXP={xpStore_1.useXPStore.getState().getXP()} maxXP={xpStore_1.useXPStore.getState().getRank().maxXP} level={xpStore_1.useXPStore.getState().getRank().level}/>
            </react_native_1.View>
            <react_native_1.View style={styles.streakContainer}>
              <StreakBadge_1.default streak={streak} showDetails={false}/>
            </react_native_1.View>
          </react_native_1.View>
          
          <react_native_1.View style={styles.progressRow}>
            <react_native_1.View style={styles.progressCard}>
              <ProgressRing_1.ProgressRing progress={65} size={80}/>
              <react_native_1.Text style={styles.progressLabel}>Course Progress</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.progressCard}>
              <ProgressRing_1.ProgressRing progress={streak > 0 ? 100 : 0} size={80}/>
              <react_native_1.Text style={styles.progressLabel}>Daily Goal</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          
          {/* Trophy Room Link */}
          <react_native_1.TouchableOpacity style={styles.trophyButton} onPress={function () { return router.push('/trophy-room'); }} activeOpacity={0.8}>
            <react_native_1.View style={styles.trophyIcon}>
              <vector_icons_1.Feather name="award" size={20} color="#FFFFFF"/>
            </react_native_1.View>
            <react_native_1.Text style={styles.trophyButtonText}>View Achievements</react_native_1.Text>
            <vector_icons_1.Feather name="chevron-right" size={20} color={colors.primary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* Exam Countdown Widget */}
        <ExamCountdownWidget_1.default limit={3} showTitle={true}/>

        {selectedClass ? (<>
            <react_native_1.Text style={styles.sectionTitle}>Your Subjects</react_native_1.Text>
            
            <react_native_1.View style={styles.subjectsGrid}>
              {subjects.map(function (subject, index) { return (<react_native_1.TouchableOpacity key={index} style={[
                    styles.subjectCard,
                    subject.includes('Coming Soon') && styles.disabledCard,
                ]} onPress={function () { return handleSubjectPress(subject); }} activeOpacity={subject.includes('Coming Soon') ? 1 : 0.7} disabled={subject.includes('Coming Soon')}>
                  <react_native_1.Text style={styles.subjectEmoji}>{getSubjectEmoji(subject)}</react_native_1.Text>
                  <react_native_1.Text style={styles.subjectName}>{subject}</react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
            </react_native_1.View>

            {classNum >= 11 && (<react_native_1.View style={styles.placeholderCard}>
                <react_native_1.Text style={styles.placeholderTitle}>🚧 Coming Soon</react_native_1.Text>
                <react_native_1.Text style={styles.placeholderText}>
                  {classNum >= 1 && classNum <= 12
                    ? 'Stream selection and specialized subjects for Classes 11-12 coming in Phase 2B'
                    : 'Pathways and specialized courses coming in Phase 2B'}
                </react_native_1.Text>
              </react_native_1.View>)}
          </>) : (<react_native_1.View style={styles.emptyState}>
            <react_native_1.Text style={styles.emptyEmoji}>📚</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>No Class Selected</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              Please create an account or sign in to select your class
            </react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.actionButton} onPress={function () { return router.replace('/auth'); }} activeOpacity={0.8}>
              <react_native_1.Text style={styles.actionButtonText}>Go to Auth</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>)}

        {userName && (<react_native_1.TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <react_native_1.Text style={styles.logoutButtonText}>Sign Out</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.Animated.View>
    </react_native_1.ScrollView>);
}
function getSubjectEmoji(subject) {
    var emojis = {
        English: '📖',
        'English I': '📖',
        'English II': '📚',
        'English Grammar': '✍️',
        Hindi: '🔤',
        'Hindi I': '🔤',
        'Hindi II': '📙',
        'Hindi Grammar': '📝',
        Maths: '🔢',
        Mathematics: '🔢',
        Science: '🔬',
        Physics: '⚡',
        Chemistry: '🧪',
        Biology: '🧬',
        'Social Science': '🌍',
        EVS: '🌱',
        'Competitive Exams': '🎯',
        'Skill Building': '🛠️',
    };
    return emojis[subject] || '📚';
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: theme_1.Spacing.xl,
        paddingTop: react_native_1.Platform.select({ ios: 110, default: 70 }),
        paddingBottom: theme_1.Spacing.xxl + 80, // Extra space for tab bar
    },
    header: {
        marginBottom: theme_1.Spacing.lg,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme_1.Spacing.md,
    },
    title: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        flex: 1,
    },
    classBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.xl,
        alignSelf: 'flex-start',
    },
    classText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
    gamificationSection: {
        marginBottom: theme_1.Spacing.xl,
    },
    gamificationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme_1.Spacing.lg,
    },
    xpBarContainer: {
        flex: 1,
        marginRight: theme_1.Spacing.md,
    },
    streakContainer: {
        width: 80,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme_1.Spacing.xl,
    },
    progressCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        alignItems: 'center',
        width: '45%',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    progressLabel: {
        marginTop: theme_1.Spacing.sm,
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    trophyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    trophyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    trophyButtonText: {
        flex: 1,
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.lg,
    },
    subjectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme_1.Spacing.sm,
        marginBottom: theme_1.Spacing.xl,
    },
    subjectCard: {
        backgroundColor: colors.primary,
        flexBasis: react_native_1.Platform.select({
            web: '31%',
            default: '46%',
        }),
        margin: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledCard: {
        backgroundColor: colors.lightGray,
        opacity: 0.7,
    },
    subjectEmoji: {
        fontSize: theme_1.FontSizes.xxxl,
        marginBottom: theme_1.Spacing.sm,
    },
    subjectName: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
        textAlign: 'center',
        lineHeight: 20,
    },
    placeholderCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xl,
        marginBottom: theme_1.Spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    placeholderTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    placeholderText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxl,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: theme_1.Spacing.lg,
    },
    emptyTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme_1.Spacing.xl,
        maxWidth: 300,
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: theme_1.Spacing.xl,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
    logoutButton: {
        backgroundColor: colors.lightGray,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.xl,
    },
    logoutButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.textSecondary,
    },
}); };
