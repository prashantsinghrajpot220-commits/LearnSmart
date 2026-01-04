import React, { useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { AppNotification } from '@/store/notificationStore';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface NotificationItemProps {
  notification: AppNotification;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}

const getNotificationIcon = (type: AppNotification['type']) => {
  switch (type) {
    case 'group_invite':
      return { icon: 'account-group-plus', color: '#6366f1', bg: '#e0e7ff' };
    case 'group_message':
      return { icon: 'message-text', color: '#8b5cf6', bg: '#ede9fe' };
    case 'group_quiz_created':
      return { icon: 'trophy', color: '#f59e0b', bg: '#fef3c7' };
    case 'group_quiz_result':
      return { icon: 'podium', color: '#ec4899', bg: '#fce7f3' };
    case 'qa_new_answer':
      return { icon: 'comment-text', color: '#3b82f6', bg: '#dbeafe' };
    case 'qa_upvote':
      return { icon: 'thumb-up', color: '#10b981', bg: '#d1fae5' };
    case 'qa_helpful_mark':
      return { icon: 'star-face', color: '#f59e0b', bg: '#fef3c7' };
    case 'qa_badge_unlock':
      return { icon: 'medal', color: '#fbbf24', bg: '#fef9c3' };
    case 'qa_leaderboard':
      return { icon: 'chart-line-variant', color: '#8b5cf6', bg: '#ede9fe' };
    case 'qa_milestone':
      return { icon: 'flag', color: '#ec4899', bg: '#fce7f3' };
    case 'achievement':
      return { icon: 'trophy-award', color: '#fbbf24', bg: '#fef9c3' };
    default:
      return { icon: 'bell', color: '#6b7280', bg: '#f3f4f6' };
  }
};

const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return created.toLocaleDateString();
};

const NotificationItem = memo(({ notification, onPress, onDelete }: NotificationItemProps) => {
  const { colors, isDark } = useTheme();
  const iconData = useMemo(() => getNotificationIcon(notification.type), [notification.type]);
  const timeAgo = useMemo(() => formatNotificationTime(notification.createdAt), [notification.createdAt]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.read ? colors.cardBackground : colors.cardBackground + 'dd',
          borderColor: notification.read ? 'transparent' : colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}

      <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
        <MaterialCommunityIcons
          name={iconData.icon as any}
          size={24}
          color={iconData.color}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {timeAgo}
        </Text>
      </View>

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(notification.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 12,
    left: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
  },
  message: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: FontSizes.xs,
    color: '#999999',
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
