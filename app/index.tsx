import React from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeSlider from '@/components/WelcomeSlider';
import { useTheme } from '@/components/ThemeContext';

export default function Index() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WelcomeSlider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
