"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerCard = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var colors_1 = require("@/constants/colors");
exports.AnswerCard = (0, react_1.memo)(function (_a) {
    var answer = _a.answer, onVote = _a.onVote, onMarkHelpful = _a.onMarkHelpful, userVote = _a.userVote;
    var isHelpful = answer.helpfulCount > 0;
    return (<react_native_1.View style={[styles.container, isHelpful && styles.helpfulBorder]}>
      {isHelpful && (<react_native_1.View style={styles.helpfulBadge}>
          <vector_icons_1.Ionicons name="checkmark-circle" size={12} color="white"/>
          <react_native_1.Text style={styles.helpfulBadgeText}>Helpful</react_native_1.Text>
        </react_native_1.View>)}
      
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.avatarPlaceholder}>
            <react_native_1.Text style={styles.avatarText}>{answer.userId.substring(5, 7).toUpperCase()}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View>
          <react_native_1.Text style={styles.userName}>Student {answer.userId.substring(5, 10)}</react_native_1.Text>
          <react_native_1.Text style={styles.timestamp}>{new Date(answer.createdAt).toLocaleString()}</react_native_1.Text>
        </react_native_1.View>
        {answer.isAIGenerated && (<react_native_1.View style={styles.aiBadge}>
            <react_native_1.Text style={styles.aiBadgeText}>Smarty AI</react_native_1.Text>
          </react_native_1.View>)}
      </react_native_1.View>

      <react_native_1.Text style={styles.text}>{answer.text}</react_native_1.Text>
      
      {answer.photo && (<react_native_1.Image source={{ uri: answer.photo }} style={styles.answerImage} resizeMode="contain"/>)}

      <react_native_1.View style={styles.footer}>
        <react_native_1.View style={styles.voteContainer}>
          <react_native_1.TouchableOpacity onPress={function () { return onVote('upvote'); }} style={[styles.voteBtn, userVote === 'upvote' && styles.activeUpvote]}>
            <vector_icons_1.Ionicons name={userVote === 'upvote' ? "caret-up" : "caret-up-outline"} size={20} color={userVote === 'upvote' ? "white" : colors_1.Colors.light.textSecondary}/>
          </react_native_1.TouchableOpacity>
          
          <react_native_1.Text style={[
            styles.voteCount,
            (answer.upvoteCount - answer.downvoteCount) > 0 && { color: colors_1.Colors.light.success },
            (answer.upvoteCount - answer.downvoteCount) < 0 && { color: colors_1.Colors.light.error }
        ]}>
            {(answer.upvoteCount || 0) - (answer.downvoteCount || 0)}
          </react_native_1.Text>

          <react_native_1.TouchableOpacity onPress={function () { return onVote('downvote'); }} style={[styles.voteBtn, userVote === 'downvote' && styles.activeDownvote]}>
            <vector_icons_1.Ionicons name={userVote === 'downvote' ? "caret-down" : "caret-down-outline"} size={20} color={userVote === 'downvote' ? "white" : colors_1.Colors.light.textSecondary}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={[styles.helpfulBtn, isHelpful && styles.helpfulBtnActive]} onPress={onMarkHelpful}>
          <vector_icons_1.Ionicons name={isHelpful ? "bulb" : "bulb-outline"} size={18} color={isHelpful ? colors_1.Colors.light.accent : colors_1.Colors.light.textSecondary}/>
          <react_native_1.Text style={[styles.helpfulText, isHelpful && styles.helpfulTextActive]}>
            {isHelpful ? "".concat(answer.helpfulCount, " Helpful") : 'Mark Helpful'}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
});
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
    },
    helpfulBorder: {
        borderColor: colors_1.Colors.light.accent,
        borderWidth: 2,
    },
    helpfulBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: colors_1.Colors.light.accent,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    helpfulBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors_1.Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors_1.Colors.light.text,
    },
    timestamp: {
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
    },
    aiBadge: {
        marginLeft: 'auto',
        backgroundColor: colors_1.Colors.light.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    aiBadgeText: {
        fontSize: 10,
        color: colors_1.Colors.light.primary,
        fontWeight: '700',
    },
    text: {
        fontSize: 15,
        color: colors_1.Colors.light.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    answerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#f0f0f0',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: colors_1.Colors.light.border,
        paddingTop: 12,
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 4,
    },
    voteBtn: {
        padding: 6,
        borderRadius: 16,
    },
    activeUpvote: {
        backgroundColor: colors_1.Colors.light.success,
    },
    activeDownvote: {
        backgroundColor: colors_1.Colors.light.error,
    },
    voteCount: {
        fontSize: 14,
        fontWeight: '700',
        marginHorizontal: 8,
        minWidth: 20,
        textAlign: 'center',
    },
    helpfulBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
    },
    helpfulBtnActive: {
        borderColor: colors_1.Colors.light.accent,
        backgroundColor: colors_1.Colors.light.accent + '10',
    },
    helpfulText: {
        fontSize: 13,
        color: colors_1.Colors.light.textSecondary,
        fontWeight: '600',
    },
    helpfulTextActive: {
        color: colors_1.Colors.light.accent,
    },
});
