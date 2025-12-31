import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export const FloatingActionButton: React.FC<FABProps> = ({ 
  onPress, 
  icon = 'robot' 
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[
      styles.container, 
      animatedStyle
    ]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={icon as any} size={28} color={colors.white} />
        {Platform.OS === 'web' && (
          <View style={[styles.tooltip, { backgroundColor: colors.text }]}>
            <Text style={[styles.tooltipText, { color: colors.background }]}>Chat with Smarty</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      }
    }),
  },
  tooltip: {
    position: 'absolute',
    right: 64,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    width: 120,
    alignItems: 'center',
    display: 'none', // Shown on hover in CSS if possible, but for RN web we'd need more logic
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default FloatingActionButton;
