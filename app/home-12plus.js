"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home12Plus;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var userStore_1 = require("@/store/userStore");
var AvatarSelector_1 = require("@/components/AvatarSelector");
var PathwaysTab_1 = require("@/components/PathwaysTab");
function Home12Plus() {
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, userStore_1.useUserStore)(), userName = _a.userName, ageGroup = _a.ageGroup, loadUserData = _a.loadUserData, logout = _a.logout, selectedAvatar = _a.selectedAvatar;
    var opacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    (0, react_1.useEffect)(function () {
        loadUserData();
        react_native_1.Animated.timing(opacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [loadUserData, opacity]);
    (0, react_1.useEffect)(function () {
        if (ageGroup === 'under12') {
            router.replace('/home');
        }
    }, [ageGroup, router]);
    var displayName = userName || 'Student';
    var styles = (0, react_1.useMemo)(function () { return getStyles(colors); }, [colors]);
    var handleLogout = function () {
        logout();
        router.replace('/');
    };
    var handleProfilePress = function () {
        router.push('/profile');
    };
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <react_native_1.Animated.View style={[styles.content, { opacity: opacity }]}>
        <react_native_1.View style={styles.header}>
          <react_native_1.View style={styles.headerTop}>
            <react_native_1.View style={{ flex: 1 }}>
              <react_native_1.Text style={styles.title}>Welcome, {displayName}</react_native_1.Text>
              <react_native_1.Text style={styles.subtitle}>Your learning dashboard</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <AvatarSelector_1.AvatarDisplay id={selectedAvatar} size={60}/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        <PathwaysTab_1.default />

        <react_native_1.View style={styles.infoCard}>
          <react_native_1.Text style={styles.infoTitle}>Age Group</react_native_1.Text>
          <react_native_1.View style={styles.infoRow}>
            <react_native_1.Text style={styles.infoValue}>12+</react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.infoButton} activeOpacity={0.8} onPress={function () {
            // Placeholder for future implementation
        }}>
              <react_native_1.Text style={styles.infoButtonText}>Change</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.Text style={styles.infoNote}>Changing age group will be available in Settings soon.</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={styles.goToSubjectsButton} activeOpacity={0.85} onPress={function () { return router.push('/home'); }}>
          <react_native_1.Text style={styles.goToSubjectsText}>Go to Subjects (Under 12 experience)</react_native_1.Text>
          <vector_icons_1.Feather name="chevron-right" size={18} color={colors.text}/>
        </react_native_1.TouchableOpacity>

        {userName && (<react_native_1.TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <react_native_1.Text style={styles.logoutButtonText}>Sign Out</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.Animated.View>
    </react_native_1.ScrollView>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
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
            paddingBottom: theme_1.Spacing.xxl + 80,
        },
        header: {
            marginBottom: theme_1.Spacing.xl,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: theme_1.Spacing.sm,
        },
        title: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            flex: 1,
        },
        subtitle: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
        },
        infoCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
            marginBottom: theme_1.Spacing.lg,
        },
        infoTitle: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme_1.Spacing.sm,
        },
        infoValue: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        infoButton: {
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.primary,
        },
        infoButtonText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.primary,
        },
        infoNote: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: 18,
        },
        goToSubjectsButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
        },
        goToSubjectsText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            flex: 1,
            marginRight: theme_1.Spacing.md,
        },
        logoutButton: {
            backgroundColor: colors.border,
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
    });
};
