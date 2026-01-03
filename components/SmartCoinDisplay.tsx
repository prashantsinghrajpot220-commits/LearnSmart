import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import { FontSizes, FontWeights } from '@/constants/theme';

interface SmartCoinDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showAnimation?: boolean;
  amount?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SmartCoinDisplay({
  size = 'medium',
  showLabel = true,
  showAnimation = false,
  amount,
}: SmartCoinDisplayProps) {
  const { colors } = useTheme();
  const { gamificationData } = useUserStore();
  const [animatedValue] = useState(new Animated.Value(0));
  
  const currentAmount = amount ?? gamificationData.smartCoins;
  const previousAmountRef = useRef(currentAmount);

  useEffect(() => {
    if (showAnimation && currentAmount > previousAmountRef.current) {
      // Start animation
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    previousAmountRef.current = currentAmount;
  }, [currentAmount, showAnimation, animatedValue]);

  const sizeStyles = {
    small: {
      icon: 20,
      text: FontSizes.sm,
      containerWidth: 80,
    },
    medium: {
      icon: 28,
      text: FontSizes.md,
      containerWidth: 120,
    },
    large: {
      icon: 40,
      text: FontSizes.xl,
      containerWidth: 180,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, { width: currentSize.containerWidth }]}>
      <Animated.View
        style={[
          styles.coinWrapper,
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="cash"
          size={currentSize.icon}
          color="#FFD700"
        />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.coinAmount,
            {
              color: colors.text,
              fontSize: currentSize.text,
            },
          ]}
        >
          {currentAmount ?? 0}
        </Text>
        {showLabel && (
          <Text
            style={[
              styles.coinLabel,
              {
                color: colors.textSecondary,
                fontSize: size === 'small' ? FontSizes.xs : FontSizes.sm,
              },
            ]}
          >
            {(currentAmount ?? 0) === 1 ? 'Coin' : 'Coins'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinWrapper: {
    marginRight: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  coinAmount: {
    fontWeight: FontWeights.bold,
  },
  coinLabel: {
    fontWeight: FontWeights.medium,
    marginTop: -2,
  },
});
