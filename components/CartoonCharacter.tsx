import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

export type AnimationState = 'idle' | 'curious' | 'surprised' | 'happy' | 'relaxed';

interface CartoonCharacterProps {
  state: AnimationState;
  size?: number;
}

export default function CartoonCharacter({ state, size = 180 }: CartoonCharacterProps) {
  const animationRef = useRef<LottieView>(null);
  const bounceAnim = useMemo(() => new Animated.Value(0), []);
  const wiggleAnim = useMemo(() => new Animated.Value(0), []);

  const startBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2)),
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.back(2)),
      }),
    ]).start();
  };

  const startWiggle = () => {
    Animated.sequence([
      Animated.timing(wiggleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (!animationRef.current) return;

    switch (state) {
      case 'idle':
        animationRef.current.play(0, 30);
        break;
      case 'curious':
        animationRef.current.play(15, 30);
        startBounce();
        break;
      case 'surprised':
        animationRef.current.play(30, 45);
        startWiggle();
        break;
      case 'happy':
        animationRef.current.play(45, 60);
        startBounce();
        break;
      case 'relaxed':
        animationRef.current.play(0, 30);
        break;
    }
  }, [state]);

  const scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const rotation = wiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ scale }, { rotate: rotation }],
          },
        ]}
      >
        <LottieView
          ref={animationRef}
          source={require('@/assets/animations/cartoon-owl.json')}
          autoPlay={false}
          loop={state === 'idle'}
          style={[styles.lottie, { width: size, height: size }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    maxWidth: Platform.select({ web: '100%' }),
  },
});
