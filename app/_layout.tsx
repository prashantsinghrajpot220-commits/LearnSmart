import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import mobileAds from '@/utils/googleAds';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import { SmartyChatProvider } from '../context/ChatContext';
import SmartyChat from '../components/SmartyChat';
import { useChatStore } from '../store/chatStore';
import { initializeNetworkListener, cleanupNetworkListener } from '../services/networkService';
import { streakService } from '../services/streakService';
import { useXPStore } from '../store/xpStore';
import { useAchievementStore } from '../store/achievementStore';
import { BottomTabNavigator } from '../components/BottomTabNavigator';
import { HeaderComponent } from '../components/HeaderComponent';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { usePathname } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';
import { analyticsService } from '@/services/AnalyticsService';
import { mistakeAnalysisService } from '@/services/MistakeAnalysisService';
import { useVoiceNoteStore } from '@/store/voiceNoteStore';
import { useNotificationStore } from '@/store/notificationStore';
import SocialNotificationBanner from '@/components/SocialNotificationBanner';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { isChatOpen, closeChat, toggleChat } = useChatStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  const { loadXP } = useXPStore();
  const { loadAchievements } = useAchievementStore();
  const { loadNotes } = useVoiceNoteStore();

  const notifications = useNotificationStore((s) => s.notifications);
  const activeNotificationId = useNotificationStore((s) => s.activeNotificationId);
  const dismissActive = useNotificationStore((s) => s.dismissActive);

  const activeNotification = useMemo(
    () => notifications.find((n) => n.id === activeNotificationId) ?? null,
    [activeNotificationId, notifications]
  );

  useEffect(() => {
    // Initialize AdMob
    if (Platform.OS !== 'web') {
      mobileAds()
        .initialize()
        .then(() => {
          console.log('AdMob initialized');
        })
        .catch((err: unknown) => {
          console.warn('AdMob initialization failed:', err);
        });
    }

    // Initialize network listener
    initializeNetworkListener();

    // Initialize gamification services
    const initializeGamification = async () => {
      try {
        // Load XP and achievements
        await loadXP();
        await loadAchievements();
        await loadNotes();
        await useNotificationStore.getState().loadNotifications();
        
        // Initialize and check streak
        await streakService.initialize();
        const streakResult = await streakService.checkAndUpdateStreak();
        
        // Initialize analytics and mistake tracking
        await analyticsService.initialize();
        await mistakeAnalysisService.initialize();
        
        // Check streak achievements
        const { checkAndUnlock } = useAchievementStore.getState();
        const { getXP, totalLessonsRead, totalQuizzesCompleted } = useXPStore.getState();

        checkAndUnlock({
          currentStreak: streakResult.streak,
          totalQuizzesCompleted,
          totalLessonsRead,
          currentXP: getXP(),
          rank: useXPStore.getState().getRank().name,
        });
      } catch (error) {
        console.error('Failed to initialize gamification:', error);
      }
      
      // Delay setting loaded state to avoid sync setState in effect
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    };

    initializeGamification();

    return () => {
      cleanupNetworkListener();
    };
  }, [loadXP, loadAchievements, loadNotes]);

  const showFloatingChat = !['/chat', '/auth', '/'].includes(pathname);

  if (!isLoaded) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="home" />
          <Stack.Screen name="home-12plus" />
          <Stack.Screen name="chapters" />
          <Stack.Screen name="lesson" />
          <Stack.Screen name="trophy-room" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="community" />
          <Stack.Screen name="group/[groupId]" />
          <Stack.Screen name="qa-forum" />
          <Stack.Screen name="question-detail" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      {activeNotification ? (
        <SocialNotificationBanner
          notification={activeNotification}
          onDismiss={() => {
            dismissActive();
          }}
        />
      ) : null}
      <HeaderComponent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="home" />
        <Stack.Screen name="home-12plus" />
        <Stack.Screen name="chapters" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="trophy-room" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="community" />
        <Stack.Screen name="group/[groupId]" />
        <Stack.Screen
          name="qa-forum"
          options={{
            headerShown: true,
            title: 'Q&A Forum',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="question-detail"
          options={{
            headerShown: true,
            title: 'Question',
          }}
        />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="about" />
        <Stack.Screen
          name="weak-areas"
          options={{
            headerShown: true,
            title: 'Weak Areas',
          }}
        />
        <Stack.Screen
          name="personalized-plan"
          options={{
            headerShown: true,
            title: 'Study Plan',
          }}
        />
        <Stack.Screen
          name="voice-notes"
          options={{
            headerShown: true,
            title: 'Voice Notes',
          }}
        />
        <Stack.Screen
          name="analytics"
          options={{
            headerShown: true,
            title: 'Analytics',
          }}
        />
        <Stack.Screen
          name="coin-history"
          options={{
            headerShown: true,
            title: 'SmartCoin History',
          }}
        />
      </Stack>
      <BottomTabNavigator />
      {showFloatingChat && <FloatingActionButton onPress={toggleChat} />}
      {isChatOpen && <SmartyChat onClose={closeChat} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SmartyChatProvider>
        <ErrorBoundary>
          <RootLayoutContent />
        </ErrorBoundary>
      </SmartyChatProvider>
    </ThemeProvider>
  );
}
