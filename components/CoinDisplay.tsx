import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface CoinDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
  style?: any;
}

export default function CoinDisplay({ 
  size = 'medium', 
  showLabel = true, 
  animated = false,
  style 
}: CoinDisplayProps) {
  const { gamificationData } = useUserStore();
  const [animatedValue] = React.useState(new Animated.Value(1));

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return FontSizes.sm;
      case 'large': return FontSizes.lg;
      default: return FontSizes.md;
    }
  };

  const triggerAnimation = () => {
    if (animated) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  React.useEffect(() => {
    if (animated) {
      triggerAnimation();
    }
  }, [gamificationData.smartCoins]);

  const styles = getStyles(getIconSize(), getTextSize());

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.coinContainer, { transform: [{ scale: animatedValue }] }]}>
        <MaterialCommunityIcons 
          name="currency-usd" 
          size={getIconSize()} 
          color="#FFD700" 
          style={styles.coinIcon}
        />
      </Animated.View>
      <Text style={[styles.amount, { fontSize: getTextSize() }]}>
        {gamificationData.smartCoins.toLocaleString()}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { fontSize: getTextSize() - 2 }]}>
          SmartCoins
        </Text>
      )}
    </View>
  );
}

const getStyles = (iconSize: number, textSize: number) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinContainer: {
    marginRight: 8,
  },
  coinIcon: {
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  amount: {
    fontWeight: FontWeights.bold,
    color: '#FFD700',
    marginRight: 4,
  },
  label: {
    color: '#999999',
    fontWeight: FontWeights.medium,
  },
});