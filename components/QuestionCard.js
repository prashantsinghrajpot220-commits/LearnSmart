"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCard = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var colors_1 = require("@/constants/colors");
var userStore_1 = require("@/store/userStore");
exports.QuestionCard = (0, react_1.memo)(function (_a) {
    var question = _a.question, onPress = _a.onPress, _b = _a.showFavorite, showFavorite = _b === void 0 ? true : _b;
    var _c = (0, userStore_1.useUserStore)(), isFavorite = _c.isFavorite, addToFavorites = _c.addToFavorites, removeFromFavorites = _c.removeFromFavorites;
    var favorite = isFavorite(question.id);
    var handleFavoritePress = function (e) {
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(question.id);
        }
        else {
            addToFavorites(question.id);
        }
    };
    var getDifficultyColor = function () {
        switch (question.difficulty) {
            case 'easy': return colors_1.Colors.light.success;
            case 'medium': return colors_1.Colors.light.warning;
            case 'hard': return colors_1.Colors.light.error;
            default: return colors_1.Colors.light.textSecondary;
        }
    };
    return (<react_native_1.TouchableOpacity style={styles.card} onPress={onPress}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={[styles.badge, { backgroundColor: getDifficultyColor() + '20' }]}>
          <react_native_1.Text style={[styles.badgeText, { color: getDifficultyColor() }]}>
            {question.difficulty.toUpperCase()}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.Text style={styles.subjectText}>{question.subject} • {question.topic}</react_native_1.Text>
        {showFavorite && (<react_native_1.TouchableOpacity style={styles.favoriteBtn} onPress={handleFavoritePress}>
            <vector_icons_1.Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? colors_1.Colors.light.primary : colors_1.Colors.light.textSecondary}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>
      
      <react_native_1.Text style={styles.title} numberOfLines={2}>{question.title}</react_native_1.Text>
      
      <react_native_1.View style={styles.footer}>
        <react_native_1.View style={styles.stat}>
          <vector_icons_1.Ionicons name="chatbubble-outline" size={16} color={colors_1.Colors.light.textSecondary}/>
          <react_native_1.Text style={styles.statText}>{question.answerCount || 0} answers</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.stat}>
          <vector_icons_1.Ionicons name="eye-outline" size={16} color={colors_1.Colors.light.textSecondary}/>
          <react_native_1.Text style={styles.statText}>{question.viewCount || 0} views</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.Text style={styles.timeText}>{new Date(question.createdAt).toLocaleDateString()}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
});
var styles = react_native_1.StyleSheet.create({
    card: {
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    subjectText: {
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
        fontWeight: '500',
        flex: 1,
    },
    favoriteBtn: {
        padding: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors_1.Colors.light.text,
        marginBottom: 12,
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
    },
    timeText: {
        marginLeft: 'auto',
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
    },
});
