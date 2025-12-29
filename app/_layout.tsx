import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import { SmartyChatProvider } from '../context/ChatContext';
import SmartyFloatingButton from '../components/SmartyFloatingButton';
import SmartyChat from '../components/SmartyChat';
import { useChatStore } from '../store/chatStore';
import { initializeNetworkListener, cleanupNetworkListener } from '../services/networkService';
import { streakService } from '../services/streakService';
import { useXPStore } from '../store/xpStore';
import { useAchievementStore } from '../store/achievementStore';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { isChatOpen, closeChat } = useChatStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const { loadXP } = useXPStore();
  const { loadAchievements } = useAchievementStore();
  const [streakChecked, setStreakChecked] = useState(false);

  useEffect(() => {
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
          <Stack.Screen name="chapters" />
          <Stack.Screen name="lesson" />
          <Stack.Screen name="trophy-room" />
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
        <Stack.Screen name="chapters" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="trophy-room" />
      </Stack>
      <SmartyFloatingButton onPress={() => {}} />
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
