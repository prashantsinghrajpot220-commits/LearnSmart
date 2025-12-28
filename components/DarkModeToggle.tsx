import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { Spacing } from '@/constants/theme';

export const DarkModeToggle: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const animatedValue = React.useMemo(() => new Animated.Value(0), []);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    toggleTheme();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={24}
          color={colors.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
});
