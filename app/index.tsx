import React from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeSlider from '@/components/WelcomeSlider';
import { Colors } from '@/constants/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <WelcomeSlider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
