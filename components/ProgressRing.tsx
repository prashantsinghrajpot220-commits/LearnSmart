import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from './ThemeContext';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size = 60, 
  strokeWidth = 6,
  showText = true 
}) => {
  const { colors } = useTheme();

  // Fallback to a circular progress bar using Views if SVG is not available
  // Here we use a simpler circular indicator
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[
        styles.outerCircle, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          borderWidth: strokeWidth,
          borderColor: colors.border,
        }
      ]}>
        {/* Simple representation: color intensity or just a text for now if complex circles are not possible */}
        <View style={styles.textContainer}>
          {showText && (
            <Text style={[styles.text, { color: colors.primary, fontSize: size * 0.25 }]}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      </View>
      {/* Small indicator of progress */}
      <View style={[
        styles.indicator,
        {
          borderColor: colors.primary,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderTopColor: colors.primary,
          borderRightColor: progress >= 25 ? colors.primary : 'transparent',
          borderBottomColor: progress >= 50 ? colors.primary : 'transparent',
          borderLeftColor: progress >= 75 ? colors.primary : 'transparent',
          position: 'absolute',
          transform: [{ rotate: '45deg' }]
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});

export default ProgressRing;
