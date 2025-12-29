import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useCurrentRank, Rank } from '@/store/xpStore';

interface RankDisplayProps {
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
}

export default function RankDisplay({
  showProgress = false,
  size = 'medium',
  showAnimation = false,
}: RankDisplayProps) {
  const { colors, isDark } = useTheme();
  const { rank, progress, currentXP, xpToNext } = useCurrentRank();

  const scale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
  const iconSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;
  const textSize = size === 'small' ? FontSizes.sm : size === 'large' ? FontSizes.xl : FontSizes.lg;

  const styles = getStyles(colors, isDark, size);

  const isMaxRank = !Number.isFinite(xpToNext) || xpToNext <= 0;
  const maxXP = isMaxRank ? currentXP : rank.maxXP;

  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      <View style={styles.badgeContainer}>
        <View style={[styles.iconContainer, { borderColor: rank.color }]}>
          <Text style={[styles.icon, { fontSize: iconSize }]}>{rank.icon}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.rankLabel}>Current Rank</Text>
          <Text style={[styles.rankName, { color: rank.color }]}>{rank.name}</Text>
          
          {showProgress && (
            <View style={styles.progressInfo}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress * 100, 100)}%`,
                      backgroundColor: rank.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {currentXP} / {isMaxRank ? '∞' : maxXP} XP
              </Text>
            </View>
          )}
        </View>
      </View>

      {showAnimation && !isMaxRank && (
        <View style={styles.nextRankHint}>
          <Text style={styles.nextRankText}>
            ⬆️ {rank.name === 'Novice' ? 'Seeker' : rank.name === 'Seeker' ? 'Scholar' : 'Sage'} in {xpToNext} XP
          </Text>
        </View>
      )}
    </View>
  );
}

interface RankBadgeProps {
  rank: Rank;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function RankBadge({ rank, size = 'medium', showLabel = true }: RankBadgeProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark, size);

  const scale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
  const iconSize = size === 'small' ? 20 : size === 'large' ? 40 : 28;

  return (
    <View style={[styles.badgeOnly, { transform: [{ scale }] }]}>
      <View style={[styles.badgeIconContainer, { borderColor: rank.color }]}>
        <Text style={{ fontSize: iconSize }}>{rank.icon}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.badgeLabel, { color: rank.color }]}>{rank.name}</Text>
      )}
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean, size: string) => {
  const padding = size === 'small' ? Spacing.sm : size === 'large' ? Spacing.xl : Spacing.lg;
  const borderRadius = size === 'small' ? BorderRadius.md : BorderRadius.lg;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: padding,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    icon: {
      // Icon is rendered as text (emoji)
    },
    infoContainer: {
      flex: 1,
    },
    rankLabel: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    rankName: {
      fontSize: size === 'small' ? FontSizes.lg : FontSizes.xl,
      fontWeight: FontWeights.bold,
      marginBottom: Spacing.xs,
    },
    progressInfo: {
      marginTop: Spacing.xs,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.lightGray,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
    },
    nextRankHint: {
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.lightGray,
      alignItems: 'center',
    },
    nextRankText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      fontWeight: FontWeights.medium,
    },
    // Badge-only styles
    badgeOnly: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: Spacing.sm,
      borderRadius: BorderRadius.lg,
    },
    badgeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    badgeLabel: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
    },
  });
};
