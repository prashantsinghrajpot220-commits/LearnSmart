"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SessionCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var vector_icons_1 = require("@expo/vector-icons");
function SessionCard(_a) {
    var session = _a.session, colors = _a.colors;
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    var formatTime = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    var formatDuration = function (seconds) {
        var mins = Math.floor(seconds / 60);
        return "".concat(mins, "m");
    };
    var getFocusScoreColor = function (score) {
        if (score >= 90)
            return colors.success || '#4CAF50';
        if (score >= 70)
            return '#8BC34A';
        if (score >= 50)
            return colors.warning || '#FFC107';
        return colors.error || '#F44336';
    };
    var getFocusScoreLabel = function (score) {
        if (score >= 90)
            return 'Excellent';
        if (score >= 70)
            return 'Great';
        if (score >= 50)
            return 'Good';
        if (score >= 30)
            return 'Fair';
        return 'Needs Focus';
    };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.View style={styles.headerLeft}>
          <react_native_1.Text style={styles.date}>{formatDate(session.startTime)}</react_native_1.Text>
          <react_native_1.Text style={styles.time}>{formatTime(session.startTime)}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.headerRight}>
          {session.treeSurvived ? (<react_native_1.View style={styles.treeBadge}>
              <vector_icons_1.Feather name="check-circle" size={16} color="#4CAF50"/>
              <react_native_1.Text style={styles.treeBadgeText}>Tree Grown</react_native_1.Text>
            </react_native_1.View>) : (<react_native_1.View style={styles.treeBadgeDead}>
              <vector_icons_1.Feather name="x-circle" size={16} color="#F44336"/>
              <react_native_1.Text style={styles.treeBadgeText}>Tree Died</react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.content}>
        <react_native_1.View style={styles.infoRow}>
          <react_native_1.View style={styles.infoItem}>
            <vector_icons_1.Feather name="clock" size={16} color={colors.textSecondary}/>
            <react_native_1.Text style={styles.infoText}>
              Studied for {formatDuration(session.actualStudyTime)}
            </react_native_1.Text>
          </react_native_1.View>
          {session.subject && (<react_native_1.View style={styles.infoItem}>
              <vector_icons_1.Feather name="book" size={16} color={colors.textSecondary}/>
              <react_native_1.Text style={styles.infoText} numberOfLines={1}>
                {session.subject}
                {session.chapter && " \u2022 ".concat(session.chapter)}
              </react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>

        <react_native_1.View style={styles.scoreRow}>
          <react_native_1.Text style={styles.scoreLabel}>Focus Score</react_native_1.Text>
          <react_native_1.View style={styles.scoreContainer}>
            <react_native_1.View style={[
            styles.scoreBadge,
            { backgroundColor: getFocusScoreColor(session.focusScore) },
        ]}>
              <react_native_1.Text style={styles.scoreValue}>{session.focusScore}%</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.Text style={[styles.scoreText, { color: getFocusScoreColor(session.focusScore) }]}>
              {getFocusScoreLabel(session.focusScore)}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        headerLeft: {
            flex: 1,
        },
        headerRight: {},
        date: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.text,
            marginBottom: theme_1.Spacing.xs,
        },
        time: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
        treeBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.xs,
            backgroundColor: '#E8F5E9',
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.sm,
        },
        treeBadgeDead: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.xs,
            backgroundColor: '#FFEBEE',
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.sm,
        },
        treeBadgeText: {
            fontSize: theme_1.FontSizes.xs,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.textSecondary,
        },
        content: {
            gap: theme_1.Spacing.md,
        },
        infoRow: {
            gap: theme_1.Spacing.sm,
        },
        infoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.sm,
        },
        infoText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            flex: 1,
        },
        scoreRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: theme_1.Spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        scoreLabel: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
        },
        scoreContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.sm,
        },
        scoreBadge: {
            paddingHorizontal: theme_1.Spacing.sm,
            paddingVertical: theme_1.Spacing.xs,
            borderRadius: theme_1.BorderRadius.sm,
        },
        scoreValue: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.white,
        },
        scoreText: {
            fontSize: theme_1.FontSizes.sm,
            fontWeight: theme_1.FontWeights.semibold,
        },
    });
};
