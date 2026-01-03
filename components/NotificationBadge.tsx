import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotificationStore } from '@/store/notificationStore';
import { useTheme } from './ThemeContext';
import { FontSizes } from '@/constants/theme';

interface NotificationBadgeProps {
  size?: number;
  showCount?: boolean;
}

export default function NotificationBadge({ size = 18, showCount = true }: NotificationBadgeProps) {
  const { colors } = useTheme();
  const { getUnreadCount } = useNotificationStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Update unread count
    const updateCount = () => {
      setUnreadCount(getUnreadCount());
    };

    updateCount();

    // Set up a listener to update when notifications change
    const interval = setInterval(updateCount, 2000);

    return () => clearInterval(interval);
  }, [getUnreadCount]);

  if (unreadCount === 0) {
    return null;
  }

  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.error,
          width: showCount ? (displayCount.length > 1 ? size * 1.6 : size) : 8,
          height: showCount ? size : 8,
        },
        !showCount && styles.dotOnly,
      ]}
    >
      {showCount && (
        <Text
          style={[
            styles.badgeText,
            {
              fontSize: displayCount.length > 1 ? FontSizes.xs : FontSizes.sm,
              color: colors.white,
            },
          ]}
        >
          {displayCount}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  dotOnly: {
    minWidth: 8,
    paddingHorizontal: 0,
  },
  badgeText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 14,
  },
});
