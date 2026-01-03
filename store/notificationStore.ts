import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type AppNotificationType =
  | 'group_invite'
  | 'group_message'
  | 'group_quiz_created'
  | 'group_quiz_result'
  | 'qa_new_answer'
  | 'qa_upvote'
  | 'qa_helpful_mark'
  | 'qa_badge_unlock'
  | 'qa_leaderboard'
  | 'qa_milestone'
  | 'achievement';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: Record<string, unknown>;
}

interface NotificationState {
  notifications: AppNotification[];
  activeNotificationId: string | null;

  loadNotifications: () => Promise<void>;
  pushNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & { id?: string }) => Promise<void>;
  dismissActive: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  getUnreadCount: () => number;
  getNotificationsByType: (type: AppNotificationType) => AppNotification[];
  removeNotification: (id: string) => Promise<void>;
}

const STORAGE_KEY = '@learnsmart/in_app_notifications';
const MAX_NOTIFICATIONS = 50;

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  activeNotificationId: null,

  loadNotifications: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const notifications = raw ? (JSON.parse(raw) as AppNotification[]) : [];
      const activeNotificationId = notifications.find((n) => !n.read)?.id ?? null;
      set({ notifications, activeNotificationId });
    } catch (error) {
      console.error('Failed to load notifications:', error);
      set({ notifications: [], activeNotificationId: null });
    }
  },

  pushNotification: async (notification) => {
    const current = get().notifications;

    const nextNotification: AppNotification = {
      id: notification.id ?? generateId('notif'),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      createdAt: new Date().toISOString(),
      read: false,
      data: notification.data,
    };

    const next = [nextNotification, ...current].slice(0, MAX_NOTIFICATIONS);
    const activeNotificationId = get().activeNotificationId ?? nextNotification.id;

    set({ notifications: next, activeNotificationId });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  },

  dismissActive: async () => {
    const { activeNotificationId } = get();
    if (!activeNotificationId) return;

    const notifications = get().notifications.map((n) =>
      n.id === activeNotificationId ? { ...n, read: true } : n
    );

    const nextActive = notifications.find((n) => !n.read)?.id ?? null;
    set({ notifications, activeNotificationId: nextActive });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  },

  markAsRead: async (id: string) => {
    const notifications = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    const nextActive = (get().activeNotificationId === id ? notifications.find((n) => !n.read)?.id ?? null : get().activeNotificationId);

    set({ notifications, activeNotificationId: nextActive });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },

  markAllAsRead: async () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications, activeNotificationId: null });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  },

  clearAll: async () => {
    set({ notifications: [], activeNotificationId: null });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },

  getNotificationsByType: (type: AppNotificationType) => {
    return get().notifications.filter((n) => n.type === type);
  },

  removeNotification: async (id: string) => {
    const notifications = get().notifications.filter((n) => n.id !== id);
    const nextActive = get().activeNotificationId === id
      ? notifications.find((n) => !n.read)?.id ?? null
      : get().activeNotificationId;

    set({ notifications, activeNotificationId: nextActive });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  },
}));
