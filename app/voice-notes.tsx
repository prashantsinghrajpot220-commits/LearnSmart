import React from 'react';
import { View, StyleSheet } from 'react-native';
import VoiceNotesScreen from '@/screens/VoiceNotesScreen';
import { useTheme } from '@/components/ThemeContext';

export default function VoiceNotesPage() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoiceNotesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});
