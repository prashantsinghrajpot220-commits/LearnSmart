import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useNotificationStore, AppNotification } from '@/store/notificationStore';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import NotificationItem from '../components/NotificationItem';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export default function NotificationCenterScreen() {
  const { colors } = useTheme();
  const {
    notifications,
    loadNotifications,
    markAllAsRead,
    clearAll,
    removeNotification,
    getUnreadCount,
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAll();
          },
        },
      ]
    );
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    removeNotification(notificationId);
  };

  const getFilteredNotifications = (): AppNotification[] => {
    if (filterType === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = getUnreadCount();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMarkAllRead}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClearAll}
            >
              <Text style={[styles.actionButtonText, { color: colors.error }]}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.filterBar, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filterType === 'all' ? colors.white : colors.text },
          ]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'unread' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilterType('unread')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filterType === 'unread' ? colors.white : colors.text },
          ]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={80}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              {filterType === 'unread' ? 'No unread notifications' : 'No notifications'}
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {filterType === 'unread'
                ? 'All your notifications have been read'
                : 'You\'re all caught up! Check back later for updates.'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={handleDeleteNotification}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.sm,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.lg,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
