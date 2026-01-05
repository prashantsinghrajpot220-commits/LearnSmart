"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EngagementSuggestions;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var theme_1 = require("@/constants/theme");
function EngagementSuggestions(_a) {
    var onDismiss = _a.onDismiss;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _b = (0, userStore_1.useUserStore)(), userAnswers = _b.userAnswers, answerStreakCount = _b.answerStreakCount;
    var getSuggestion = function () {
        // Check streak and suggest if it's low
        if (answerStreakCount === 0) {
            return {
                icon: 'fire-alert',
                title: 'Start Your Streak!',
                message: 'Answer a question today to start your daily streak and earn coins.',
                action: 'Go to Forum',
            };
        }
        // Check if user has few answers
        if (userAnswers.length < 3) {
            return {
                icon: 'lightbulb-on',
                title: 'Help Others Learn',
                message: 'Share your knowledge by answering questions from other students.',
                action: 'Browse Questions',
            };
        }
        // General encouragement
        return {
            icon: 'hand-heart',
            title: 'Keep Helping!',
            message: 'Your answers help others learn. Keep up the great work!',
            action: 'Continue',
        };
    };
    var suggestion = getSuggestion();
    return (<react_native_1.View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <react_native_1.View style={styles.content}>
        <react_native_1.View style={[styles.iconWrapper, { backgroundColor: colors.primary + '20' }]}>
          <vector_icons_1.MaterialCommunityIcons name={suggestion.icon} size={32} color={colors.primary}/>
        </react_native_1.View>
        <react_native_1.View style={styles.textContainer}>
          <react_native_1.Text style={[styles.title, { color: colors.text }]}>{suggestion.title}</react_native_1.Text>
          <react_native_1.Text style={[styles.message, { color: colors.textSecondary }]}>
            {suggestion.message}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.TouchableOpacity style={[styles.dismissButton, { borderColor: colors.lightGray }]} onPress={onDismiss}>
          <vector_icons_1.MaterialCommunityIcons name="close" size={16} color={colors.textSecondary}/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        marginHorizontal: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: theme_1.Spacing.md,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        marginBottom: 4,
    },
    message: {
        fontSize: theme_1.FontSizes.sm,
        lineHeight: 18,
    },
    dismissButton: {
        width: 28,
        height: 28,
        borderRadius: theme_1.BorderRadius.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme_1.Spacing.sm,
    },
});
