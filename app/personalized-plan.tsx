import React from 'react';
import { View, StyleSheet } from 'react-native';
import PersonalizedPlanScreen from '@/screens/PersonalizedPlanScreen';
import { useTheme } from '@/components/ThemeContext';

export default function PersonalizedPlanPage() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PersonalizedPlanScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
