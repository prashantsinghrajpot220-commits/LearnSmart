import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import { SmartyChatProvider } from '../context/ChatContext';
import SmartyFloatingButton from '../components/SmartyFloatingButton';
import SmartyChat from '../components/SmartyChat';
import { useChatStore } from '../store/chatStore';
import { initializeNetworkListener, cleanupNetworkListener } from '../services/networkService';
import { streakService } from '../services/streakService';
import { useXPStore } from '../store/xpStore';
import { useAchievementStore } from '../store/achievementStore';
import { BottomTabNavigator } from '../components/BottomTabNavigator';
import { usePathname } from 'expo-router';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { isChatOpen, closeChat } = useChatStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  const { loadXP } = useXPStore();
  const { loadAchievements } = useAchievementStore();
  const [streakChecked, setStreakChecked] = useState(false);

  useEffect(() => {
    // Initialize AdMob
    if (Platform.OS !== 'web') {
      mobileAds()
        .initialize()
        .then(adapterStatuses => {
          console.log('AdMob initialized');
        })
        .catch(err => {
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
        
        // Initialize and check streak
        await streakService.initialize();
        const streakResult = await streakService.checkAndUpdateStreak();
        
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
        
        setStreakChecked(true);
      } catch (error) {
        console.error('Failed to initialize gamification:', error);
        setStreakChecked(true);
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
  }, [loadXP, loadAchievements]);

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
        </Stack>
      </>
    );
  }

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
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="about" />
      </Stack>
      <BottomTabNavigator />
      {showFloatingChat && <SmartyFloatingButton onPress={() => {}} />}
      {isChatOpen && <SmartyChat onClose={closeChat} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SmartyChatProvider>
        <RootLayoutContent />
      </SmartyChatProvider>
    </ThemeProvider>
  );
}
