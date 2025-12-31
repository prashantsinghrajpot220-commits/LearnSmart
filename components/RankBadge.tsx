import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCurrentRank } from '@/store/xpStore';
import { useUserStore } from '@/store/userStore';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

interface RankBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  clickable?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function RankBadge({ 
  size = 'medium', 
  showProgress = false, 
  clickable = false,
  onPress,
  style 
}: RankBadgeProps) {
  const { rank, progress, xpToNext } = useCurrentRank();
  const { gamificationData } = useUserStore();

  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: 6, borderRadius: 12 },
          icon: 16,
          name: FontSizes.xs,
          progress: FontSizes.xs,
        };
      case 'large':
        return {
          container: { padding: 16, borderRadius: 20 },
          icon: 32,
          name: FontSizes.lg,
          progress: FontSizes.sm,
        };
      default:
        return {
          container: { padding: 10, borderRadius: 16 },
          icon: 24,
          name: FontSizes.md,
          progress: FontSizes.xs,
        };
    }
  };

  const sizeConfig = getSize();
  const styles = getStyles(rank.color, sizeConfig);

  const BadgeComponent = (
    <View style={[styles.container, sizeConfig.container, style]}>
      <Text style={[styles.icon, { fontSize: sizeConfig.icon }]}>{rank.icon}</Text>
      <View style={styles.textContainer}>
        <Text style={[styles.rankName, { fontSize: sizeConfig.name }]}>{rank.name}</Text>
        {showProgress && xpToNext > 0 && (
          <Text style={[styles.progress, { fontSize: sizeConfig.progress }]}>
            {xpToNext} XP to {rank.name === 'Guru' ? 'Max' : 'Next'}
          </Text>
        )}
      </View>
    </View>
  );

  if (clickable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {BadgeComponent}
      </TouchableOpacity>
    );
  }

  return BadgeComponent;
}

const getStyles = (color: string, sizeConfig: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color + '20', // 20% opacity
    borderWidth: 2,
    borderColor: color,
    ...sizeConfig.container,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  rankName: {
    fontWeight: FontWeights.bold,
    color: color,
    marginBottom: 2,
  },
  progress: {
    color: '#666666',
    fontWeight: FontWeights.medium,
  },
});