import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CoinRewardAnimationProps {
  amount: number;
  duration?: number;
  onAnimationComplete?: () => void;
}

export default function CoinRewardAnimation({
  amount,
  duration = 2000,
  onAnimationComplete,
}: CoinRewardAnimationProps) {
  const { colors } = useTheme();
  const { gamificationData } = useUserStore();
  const [visible, setVisible] = useState(true);

  const coinAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial pop animation
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.back(1.7)),
      useNativeDriver: true,
    }).start();

    // Float up animation
    Animated.timing(coinAnimation, {
      toValue: -100,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Fade in text after delay
    setTimeout(() => {
      Animated.timing(textAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, 200);

    // Fade out after duration
    Animated.timing(opacityAnimation, {
      toValue: 0,
      delay: duration - 500,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onAnimationComplete?.();
    });
  }, []);

  if (!visible) return null;

  return (
    <View style={[styles.container, { top: screenHeight / 3, left: screenWidth / 2 }]}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              { translateY: coinAnimation },
              { scale: scaleAnimation },
            ],
            opacity: opacityAnimation,
          },
        ]}
      >
        <View style={[styles.coinContainer, { backgroundColor: colors.cardBackground }]}>
          <MaterialCommunityIcons name="cash" size={60} color="#FFD700" />
          <Animated.Text
            style={[
              styles.amountText,
              {
                color: colors.text,
                opacity: textAnimation,
                transform: [{ scale: textAnimation }],
              },
            ]}
          >
            +{amount}
          </Animated.Text>
        </View>
        <Animated.Text
          style={[
            styles.congratsText,
            {
              color: colors.text,
              opacity: textAnimation,
            },
          ]}
        >
          {amount > 1 ? 'Coins earned!' : 'Coin earned!'}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    transform: [{ translateX: -75 }],
    zIndex: 9999,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  coinContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 30,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
