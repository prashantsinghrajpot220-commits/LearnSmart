import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnalyticsScreen from '@/screens/AnalyticsScreen';
import { useTheme } from '@/components/ThemeContext';

export default function AnalyticsPage() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnalyticsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});
