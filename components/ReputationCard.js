"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReputationCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var BadgeDisplay_1 = require("./BadgeDisplay");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
function ReputationCard() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    var gamificationData = (0, userStore_1.useUserStore)().gamificationData;
    var reputation = gamificationData.reputation, badges = gamificationData.badges, reputationRank = gamificationData.reputationRank;
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View>
          <react_native_1.Text style={[styles.label, { color: colors.textSecondary }]}>Reputation</react_native_1.Text>
          <react_native_1.Text style={[styles.reputationValue, { color: colors.primary }]}>{reputation}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.TouchableOpacity style={[styles.rankBadge, { backgroundColor: colors.primary + '20' }]} onPress={function () { return router.push('/reputation-leaderboard'); }}>
          <vector_icons_1.Ionicons name="trophy-outline" size={16} color={colors.primary}/>
          <react_native_1.Text style={[styles.rankText, { color: colors.primary }]}>Rank #{reputationRank || '--'}</react_native_1.Text>
          <vector_icons_1.Ionicons name="chevron-forward" size={16} color={colors.primary}/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      <react_native_1.View style={[styles.divider, { backgroundColor: colors.border }]}/>

      <react_native_1.Text style={[styles.sectionTitle, { color: colors.text }]}>Badges ({badges.length})</react_native_1.Text>
      
      {badges.length > 0 ? (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeList}>
          {badges.map(function (badge) { return (<BadgeDisplay_1.default key={badge.id} badge={badge} size="sm"/>); })}
        </react_native_1.ScrollView>) : (<react_native_1.Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No badges earned yet. Be helpful in the community to earn badges!
        </react_native_1.Text>)}

      <react_native_1.TouchableOpacity style={[styles.footer, { borderTopColor: colors.border }]} onPress={function () { return router.push('/trophy-room'); }}>
        <react_native_1.Text style={[styles.footerText, { color: colors.primary }]}>View all achievements</react_native_1.Text>
        <vector_icons_1.Ionicons name="arrow-forward" size={14} color={colors.primary}/>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        borderWidth: 1,
        marginBottom: theme_1.Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    label: {
        fontSize: theme_1.FontSizes.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    reputationValue: {
        fontSize: 36,
        fontWeight: theme_1.FontWeights.bold,
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.sm,
        paddingVertical: 6,
        borderRadius: theme_1.BorderRadius.full,
    },
    rankText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.semibold,
        marginHorizontal: 4,
    },
    divider: {
        height: 1,
        marginVertical: theme_1.Spacing.md,
        opacity: 0.5,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: theme_1.Spacing.sm,
    },
    badgeList: {
        flexDirection: 'row',
    },
    emptyText: {
        fontSize: theme_1.FontSizes.xs,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.md,
        paddingTop: theme_1.Spacing.sm,
        borderTopWidth: 1,
    },
    footerText: {
        fontSize: theme_1.FontSizes.xs,
        fontWeight: theme_1.FontWeights.semibold,
        marginRight: 4,
    },
});
