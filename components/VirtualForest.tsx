import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { focusTracker } from '@/services/FocusTracker';
import { Tree } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';

interface VirtualForestProps {
  sessionId?: string;
  showHistory?: boolean;
}

export default function VirtualForest({ sessionId, showHistory = false }: VirtualForestProps) {
  const { colors } = useTheme();
  const [currentGrowth, setCurrentGrowth] = useState(0);
  const [isTreeAlive, setIsTreeAlive] = useState(false);
  const [treeType, setTreeType] = useState<Tree['type']>('oak');
  const [recentTrees, setRecentTrees] = useState<Tree[]>([]);
  const [forestStats, setForestStats] = useState({
    totalTrees: 0,
    treesThisWeek: 0,
    forestScore: 0,
  });

  useEffect(() => {
    loadForestData();
    
    // Subscribe to growth updates
    const interval = setInterval(() => {
      if (sessionId) {
        setCurrentGrowth(focusTracker.getCurrentGrowth());
        setIsTreeAlive(focusTracker.isTreeAlive());
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sessionId]);

  const loadForestData = async () => {
    const trees = await focusTracker.getRecentTrees(20);
    const stats = await focusTracker.getForestStats();
    setRecentTrees(trees);
    setForestStats(stats);
  };

  const handleRestartTree = async () => {
    if (sessionId) {
      await focusTracker.restartTree(sessionId);
      setCurrentGrowth(0);
      setIsTreeAlive(true);
    }
  };

  const getTreeSize = (growth: number): number => {
    const baseSize = 40;
    const maxSize = 100;
    return baseSize + (growth / 100) * (maxSize - baseSize);
  };

  const getTreeOpacity = (growth: number, alive: boolean): number => {
    if (!alive) return 0.3;
    return 0.5 + (growth / 100) * 0.5;
  };

  const renderTree = (tree: Tree, index: number, isCurrent = false) => {
    const treeEmoji = focusTracker.getTreeEmoji(tree.type);
    const size = isCurrent ? getTreeSize(currentGrowth) : getTreeSize(tree.growth);
    const opacity = isCurrent ? getTreeOpacity(currentGrowth, isTreeAlive) : getTreeOpacity(tree.growth, tree.alive);
    const isDead = isCurrent ? !isTreeAlive : !tree.alive;

    return (
      <View key={tree.id || index} style={[styles.treeContainer, { width: size + 20 }]}>
        <View
          style={[
            styles.tree,
            {
              width: size,
              height: size,
              opacity,
              transform: [{ scale: isDead ? 0.8 : 1 }],
            },
          ]}
        >
          <Text style={[styles.treeEmoji, { fontSize: size * 0.6 }]}>{treeEmoji}</Text>
          {isDead && <Text style={styles.deadIcon}>💀</Text>}
        </View>
        {!isCurrent && !isDead && tree.growth >= 100 && (
          <View style={styles.grownBadge}>
            <Feather name="check-circle" size={12} color="#4CAF50" />
          </View>
        )}
      </View>
    );
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {/* Forest Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Virtual Forest</Text>
          <Text style={styles.subtitle}>
            {isTreeAlive
              ? 'Stay focused to grow your tree!'
              : 'Tree died • Restart to try again'}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{forestStats.treesThisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{forestStats.totalTrees}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Current Growing Tree */}
      {sessionId && (
        <View style={styles.currentTreeSection}>
          <Text style={styles.sectionTitle}>Growing Now</Text>
          <View style={styles.currentTreeContainer}>
            {isTreeAlive ? (
              <View style={styles.growingTreeWrapper}>
                <View
                  style={[
                    styles.growingTree,
                    {
                      width: 120,
                      height: 120,
                    },
                  ]}
                >
                  <Text style={[styles.growingTreeEmoji, { fontSize: 80 }]}>
                    {focusTracker.getTreeEmoji(treeType)}
                  </Text>
                </View>
                <View style={styles.growthIndicator}>
                  <View style={styles.growthBarBackground}>
                    <View
                      style={[
                        styles.growthBarFill,
                        {
                          width: `${currentGrowth}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.growthText}>{Math.round(currentGrowth)}%</Text>
                </View>
              </View>
            ) : (
              <View style={styles.deadTreeWrapper}>
                <Text style={styles.deadTreeEmoji}>🍂</Text>
                <Text style={styles.deadText}>Oh no! Your tree died.</Text>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={handleRestartTree}
                  activeOpacity={0.8}
                >
                  <Feather name="refresh-ccw" size={18} color="#FFFFFF" />
                  <Text style={styles.restartButtonText}>Restart</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Forest History */}
      {showHistory && recentTrees.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Your Forest</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadForestData}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forestGrid}
          >
            {recentTrees.map((tree, index) => renderTree(tree, index))}
          </ScrollView>
        </View>
      )}

      {/* Empty State */}
      {showHistory && recentTrees.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>Start Your Forest</Text>
          <Text style={styles.emptyText}>
            Complete focus sessions to grow your first tree!
          </Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      maxWidth: 180,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      gap: Spacing.sm,
    },
    statItem: {
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.border,
    },
    statValue: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.primary,
    },
    statLabel: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    currentTreeSection: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    currentTreeContainer: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    growingTreeWrapper: {
      alignItems: 'center',
    },
    growingTree: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
    },
    growingTreeEmoji: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    growthIndicator: {
      width: '100%',
      alignItems: 'center',
    },
    growthBarBackground: {
      width: '100%',
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: Spacing.xs,
    },
    growthBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    growthText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: colors.textSecondary,
    },
    deadTreeWrapper: {
      alignItems: 'center',
    },
    deadTreeEmoji: {
      fontSize: 80,
      marginBottom: Spacing.md,
      opacity: 0.5,
    },
    deadText: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    restartButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.xl,
      gap: Spacing.sm,
    },
    restartButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
    historySection: {
      marginTop: Spacing.lg,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    refreshButton: {
      padding: Spacing.xs,
    },
    forestGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    treeContainer: {
      alignItems: 'center',
      position: 'relative',
    },
    tree: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderRadius: 100,
    },
    treeEmoji: {
      textAlign: 'center',
      lineHeight: 1,
    },
    deadIcon: {
      position: 'absolute',
      bottom: -5,
      right: -5,
      fontSize: 16,
    },
    grownBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 2,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
    },
    emptyEmoji: {
      fontSize: 64,
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    emptyText: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
