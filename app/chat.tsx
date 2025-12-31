import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import SmartyChat from '@/components/SmartyChat';
import { useTheme } from '@/components/ThemeContext';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.chatWrapper}>
        <SmartyChat onClose={() => router.back()} fullScreen={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    // When used as a screen, we want it to take full space
    // We might need to adjust SmartyChat styles if they are absolute
  }
});
