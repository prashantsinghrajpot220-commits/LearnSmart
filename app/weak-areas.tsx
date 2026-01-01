import React from 'react';
import { View, StyleSheet } from 'react-native';
import WeakAreasScreen from '@/screens/WeakAreasScreen';
import { HeaderButton } from '@/components/HeaderComponent';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';

export default function WeakAreasPage() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WeakAreasScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
