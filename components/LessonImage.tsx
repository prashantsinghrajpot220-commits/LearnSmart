import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useTheme } from './ThemeContext';

interface LessonImageProps {
  url: string;
  altText?: string;
  animationType?: 'fade-in' | 'slide';
}

export const LessonImage: React.FC<LessonImageProps> = ({ url, altText, animationType = 'fade-in' }) => {
  const { colors } = useTheme();
  const opacity = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ];

    if (animationType === 'slide') {
      animations.push(
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animationType, opacity, translateY]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Image
          source={{ uri: url }}
          style={styles.image}
          accessibilityLabel={altText || 'Lesson Illustration'}
          resizeMode="cover"
        />
        {altText && <Text style={[styles.altText, { color: colors.textSecondary }]}>{altText}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#f0f0f0',
  },
  altText: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
