import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useAchievementStore, Achievement, AchievementCategory } from '@/store/achievementStore';
import AchievementCard from './AchievementCard';
import { Feather } from '@expo/vector-icons';

type CategoryFilter = 'all' | AchievementCategory;

const CATEGORIES: { key: CategoryFilter; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: ' trophy' },
  { key: 'streak', label: 'Streaks', icon: 'zap' },
  { key: 'quiz', label: 'Quizzes', icon: 'clipboard' },
  { key: 'learning', label: 'Learning', icon: 'book-open' },
  { key: 'xp', label: 'XP', icon: 'star' },
];

export default function TrophyRoom() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { achievements, getUnlockedCount } = useAchievementStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') {
      return achievements;
    }
    return achievements.filter((a) => a.category === activeCategory);
  }, [achievements, activeCategory]);

  const unlockedCount = getUnlockedCount();
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Trophy Room</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Summary */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.trophyIcon}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Your Collection</Text>
            <Text style={styles.progressSubtitle}>
              {unlockedCount} of {totalCount} unlocked
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.overallProgressBar}>
          <View style={styles.overallProgressBackground}>
            <Animated.View
              style={[
                styles.overallProgressFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.progressPercent}>{progressPercent}% Complete</Text>
      </View>

      {/* Category Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabs}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryTab,
              activeCategory === cat.key && styles.categoryTabActive,
            ]}
            onPress={() => setActiveCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Feather
              name={cat.icon.trim() as any}
              size={16}
              color={activeCategory === cat.key ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.categoryTabText,
                activeCategory === cat.key && styles.categoryTabTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.achievementsGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredAchievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementWrapper}>
            <AchievementCard
              achievement={achievement}
              showUnlockDate={true}
              animateOnUnlock={false}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingTop: Platform.select({ web: Spacing.lg, default: Spacing.lg + 20 }),
      paddingBottom: Spacing.md,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: Spacing.sm,
      marginRight: Spacing.sm,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    headerRight: {
      width: 40,
    },
    progressCard: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    trophyIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    trophyEmoji: {
      fontSize: 32,
    },
    progressInfo: {
      flex: 1,
    },
    progressTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      color: colors.text,
    },
    progressSubtitle: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    overallProgressBar: {
      height: 10,
      backgroundColor: colors.lightGray,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: Spacing.sm,
    },
    overallProgressBackground: {
      flex: 1,
    },
    overallProgressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 5,
    },
    progressPercent: {
      fontSize: FontSizes.sm,
      color: colors.primary,
      fontWeight: FontWeights.semibold,
      textAlign: 'right',
    },
    categoryTabs: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      gap: Spacing.sm,
    },
    categoryTab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.xl,
      backgroundColor: colors.cardBackground,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    categoryTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryTabText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      color: colors.textSecondary,
      marginLeft: Spacing.xs,
    },
    categoryTabTextActive: {
      color: '#FFFFFF',
    },
    scrollView: {
      flex: 1,
    },
    achievementsGrid: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    achievementWrapper: {
      width: Platform.select({
        web: '48%',
        default: '100%',
      } as const),
    },
  });
