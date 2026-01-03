import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useTheme } from './ThemeContext';
import { DiagramData } from '@/constants/curriculum';
import { Feather } from '@expo/vector-icons';

interface LabeledDiagramProps {
  data: DiagramData;
}

export const LabeledDiagram: React.FC<LabeledDiagramProps> = ({ data }) => {
  const { colors } = useTheme();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Animation values
  const moveAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const rotationAnim = useSharedValue(0);

  useEffect(() => {
    if (data.animationType === 'motion') {
      moveAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    } else if (data.animationType === 'pulse' || data.animationType === 'molecular') {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1
      );
    } else if (data.type === 'pendulum' || data.type === 'physics') {
      rotationAnim.value = withRepeat(
        withSequence(
          withTiming(30, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-30, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    }
  }, [data.animationType, data.type]);

  const animatedStyle = useAnimatedStyle(() => {
    if (data.animationType === 'motion') {
      return {
        transform: [{ translateX: moveAnim.value * 100 - 50 }],
      };
    }
    if (data.animationType === 'pulse' || data.animationType === 'molecular') {
      return {
        transform: [{ scale: pulseAnim.value }],
      };
    }
    return {};
  });

  const pendulumStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -40 },
        { rotate: `${rotationAnim.value}deg` },
        { translateY: 40 }
      ],
    };
  });

  const renderVisual = () => {
    switch (data.type) {
      case 'pendulum':
        return (
          <View style={styles.visualContainer}>
            <View style={styles.support} />
            <Animated.View style={[styles.pendulumRod, pendulumStyle]}>
              <View style={[styles.pendulumBob, { backgroundColor: colors.primary }]} />
            </Animated.View>
          </View>
        );
      case 'motion':
        return (
          <View style={styles.visualContainer}>
            <View style={styles.road} />
            <Animated.View style={[styles.object, animatedStyle, { backgroundColor: colors.primary }]}>
              <Feather name="truck" size={24} color="white" />
            </Animated.View>
          </View>
        );
      case 'physics':
        return (
          <View style={styles.visualContainer}>
            <Animated.View style={[styles.object, animatedStyle, { backgroundColor: colors.primary }]}>
              <Feather name="box" size={32} color="white" />
            </Animated.View>
          </View>
        );
      case 'chemistry':
      case 'atomic':
        return (
          <View style={styles.visualContainer}>
            <Animated.View style={[styles.atom, animatedStyle, { backgroundColor: colors.primary }]}>
              <View style={styles.nucleus} />
            </Animated.View>
          </View>
        );
      case 'biology':
        return (
          <View style={styles.visualContainer}>
            <Animated.View style={[styles.cell, animatedStyle, { borderColor: colors.primary }]}>
              <View style={[styles.nucleus, { backgroundColor: colors.primary }]} />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={styles.visualContainer}>
            <Feather name="image" size={48} color={colors.textSecondary} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Diagram
      </Text>
      
      <View style={[styles.diagramArea, { backgroundColor: colors.background }]}>
        {renderVisual()}
        
        {data.labels.map((label, index) => (
          <View
            key={index}
            style={[styles.labelWrapper, { left: `${label.x}%`, top: `${label.y}%` }]}
          >
            <TouchableOpacity
              style={[styles.labelDot, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedLabel(selectedLabel === label.text ? null : label.text)}
              activeOpacity={0.7}
            >
              <Feather name="info" size={12} color="white" />
            </TouchableOpacity>
            
            {selectedLabel === label.text && (
              <View style={[styles.tooltip, { backgroundColor: colors.charcoal }]}>
                <Text style={styles.tooltipTitle}>{label.text}</Text>
                <Text style={styles.tooltipText}>{label.tooltip}</Text>
                <TouchableOpacity 
                  style={styles.closeTooltip}
                  onPress={() => setSelectedLabel(null)}
                >
                  <Feather name="x" size={12} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
      
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Tap the info icons to explore details
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  diagramArea: {
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  visualContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  support: {
    width: 60,
    height: 4,
    backgroundColor: '#333',
    position: 'absolute',
    top: 40,
  },
  pendulumRod: {
    width: 2,
    height: 100,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pendulumBob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: -10,
  },
  road: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
    borderStyle: 'dashed',
  },
  object: {
    width: 50,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  atom: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 100,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nucleus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  labelWrapper: {
    position: 'absolute',
    zIndex: 100,
  },
  labelDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tooltip: {
    position: 'absolute',
    bottom: 30,
    left: -75,
    width: 150,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    zIndex: 200,
    elevation: 10,
  },
  tooltipTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
    marginBottom: 4,
  },
  tooltipText: {
    color: '#eee',
    fontSize: 12,
    lineHeight: 16,
  },
  closeTooltip: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 2,
  },
  hint: {
    marginTop: Spacing.md,
    fontSize: FontSizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
