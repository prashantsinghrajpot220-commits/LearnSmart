import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import { SmartyChatProvider } from '../context/ChatContext';
import SmartyFloatingButton from '../components/SmartyFloatingButton';
import SmartyChat from '../components/SmartyChat';
import { useChatStore } from '../store/chatStore';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { isChatOpen, closeChat } = useChatStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay setting loaded state to avoid sync setState in effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
