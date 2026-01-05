"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoteCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
function NoteCard(_a) {
    var note = _a.note, onDelete = _a.onDelete, onToggleStar = _a.onToggleStar;
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var router = (0, expo_router_1.useRouter)();
    var styles = getStyles(colors, isDark);
    var handleDelete = function () {
        react_native_1.Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: function () { return onDelete(note.id); },
            },
        ]);
    };
    var formatDate = function (timestamp) {
        var date = new Date(timestamp);
        var now = new Date();
        var diff = now.getTime() - date.getTime();
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            return 'Today';
        if (days === 1)
            return 'Yesterday';
        if (days < 7)
            return "".concat(days, " days ago");
        return date.toLocaleDateString();
    };
    var getLanguageBadge = function (language) {
        switch (language) {
            case 'hi':
                return '🇮🇳 Hindi';
            case 'hinglish':
                return '🇮🇳 Hinglish';
            default:
                return '🇬🇧 English';
        }
    };
    return (<react_native_1.TouchableOpacity style={styles.card} onPress={function () { return router.push("/voice-notes/".concat(note.id)); }} activeOpacity={0.7}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.headerContent}>
          <react_native_1.Text style={styles.title} numberOfLines={1}>
            {note.title}
          </react_native_1.Text>
          <react_native_1.View style={styles.metaRow}>
            <react_native_1.Text style={styles.date}>{formatDate(note.updatedAt)}</react_native_1.Text>
            <react_native_1.Text style={styles.duration}>{note.duration}s</react_native_1.Text>
            <react_native_1.Text style={styles.language}>{getLanguageBadge(note.language)}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.TouchableOpacity style={styles.starButton} onPress={function (e) {
            e.stopPropagation();
            onToggleStar(note.id);
        }}>
          <react_native_1.Text style={styles.starIcon}>{note.isStarred ? '⭐' : '☆'}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      <react_native_1.Text style={styles.preview} numberOfLines={3}>
        {note.summarizedContent}
      </react_native_1.Text>

      {note.tags.length > 0 && (<react_native_1.View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map(function (tag, index) { return (<react_native_1.View key={index} style={styles.tag}>
              <react_native_1.Text style={styles.tagText}>{tag}</react_native_1.Text>
            </react_native_1.View>); })}
          {note.tags.length > 3 && (<react_native_1.Text style={styles.moreTags}>+{note.tags.length - 3}</react_native_1.Text>)}
        </react_native_1.View>)}

      <react_native_1.View style={styles.footer}>
        <react_native_1.TouchableOpacity style={styles.footerButton} onPress={function (e) {
            e.stopPropagation();
            handleDelete();
        }}>
          <react_native_1.Text style={styles.footerButtonText}>Delete</react_native_1.Text>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[styles.footerButton, styles.editButton]} onPress={function (e) {
            e.stopPropagation();
            router.push("/voice-notes/".concat(note.id, "/edit"));
        }}>
          <react_native_1.Text style={[styles.footerButtonText, { color: colors.white }]}>Edit</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme_1.Spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.xs,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme_1.Spacing.sm,
    },
    date: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
    },
    duration: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.primary,
        fontWeight: theme_1.FontWeights.medium,
    },
    language: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
    },
    starButton: {
        padding: theme_1.Spacing.xs,
        marginLeft: theme_1.Spacing.sm,
    },
    starIcon: {
        fontSize: theme_1.FontSizes.lg,
    },
    preview: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.text,
        lineHeight: theme_1.FontSizes.sm * 1.5,
        marginBottom: theme_1.Spacing.sm,
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: theme_1.Spacing.md,
        gap: theme_1.Spacing.xs,
    },
    tag: {
        backgroundColor: colors.lightGray,
        paddingHorizontal: theme_1.Spacing.sm,
        paddingVertical: theme_1.Spacing.xs,
        borderRadius: theme_1.BorderRadius.sm,
    },
    tagText: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.text,
        fontWeight: theme_1.FontWeights.medium,
    },
    moreTags: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: theme_1.Spacing.sm,
        gap: theme_1.Spacing.sm,
    },
    footerButton: {
        flex: 1,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.sm,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.primary,
    },
    editButton: {
        backgroundColor: colors.primary,
    },
}); };
