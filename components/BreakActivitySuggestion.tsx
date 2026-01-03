import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { getRandomBreakActivity, breakActivities } from '@/data/breakActivities';
import { BreakActivity } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';

interface BreakActivitySuggestionProps {
  breakDuration?: number; // in minutes
  onActivitySelect?: (activity: BreakActivity) => void;
}

export default function BreakActivitySuggestion({
  breakDuration = 5,
  onActivitySelect,
}: BreakActivitySuggestionProps) {
  const { colors } = useTheme();
  const [currentActivity, setCurrentActivity] = useState<BreakActivity | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState<BreakActivity[]>([]);

  useEffect(() => {
    if (!showAll) {
      const randomActivity = getRandomBreakActivity();
      setTimeout(() => {
        setCurrentActivity(randomActivity);
      }, 0);
    }
  }, [showAll]);

  const handleRefresh = () => {
    const randomActivity = getRandomBreakActivity();
    setCurrentActivity(randomActivity);
  };

  const handleViewAll = () => {
    // Filter activities by duration
    const filtered = breakActivities.filter(
      (activity) => activity.duration <= breakDuration
    );
    setFilteredActivities(filtered);
    setShowAll(true);
  };

  const handleActivityPress = (activity: BreakActivity) => {
    if (onActivitySelect) {
      onActivitySelect(activity);
    }
  };

  const getCategoryIcon = (category: BreakActivity['category']): string => {
    const icons: Record<BreakActivity['category'], string> = {
      physical: '🏃',
      mental: '🧘',
      creative: '🎨',
      social: '👥',
    };
    return icons[category] || '💡';
  };

  const getCategoryColor = (category: BreakActivity['category']): string => {
    const categoryColors: Record<BreakActivity['category'], string> = {
      physical: '#FF6B6B',
      mental: '#4ECDC4',
      creative: '#95E1D3',
      social: '#F38181',
    };
    return categoryColors[category] || colors.primary;
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Break Time!</Text>
          <Text style={styles.subtitle}>
            {showAll ? 'Choose an activity' : 'Here\'s a suggestion'}
          </Text>
        </View>
        {!showAll && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
          >
            <Feather name="refresh-cw" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {!showAll && currentActivity ? (
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(currentActivity.category) },
              ]}
            >
              <Text style={styles.categoryIcon}>{getCategoryIcon(currentActivity.category)}</Text>
            </View>
            <View style={styles.activityMeta}>
              <View style={styles.durationBadge}>
                <Feather name="clock" size={12} color={colors.textSecondary} />
                <Text style={styles.durationText}>{currentActivity.duration} min</Text>
              </View>
            </View>
          </View>

          <Text style={styles.activityTitle}>{currentActivity.title}</Text>
          <Text style={styles.activityDescription}>
            {currentActivity.description}
          </Text>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => handleActivityPress(currentActivity)}
            activeOpacity={0.8}
          >
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.doneButtonText}>Done!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAll}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllButtonText}>View all activities</Text>
            <Feather name="chevron-right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesList}
        >
          {filteredActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[styles.activityItem, { borderColor: getCategoryColor(activity.category) }]}
              onPress={() => handleActivityPress(activity)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.activityItemIcon,
                  { backgroundColor: getCategoryColor(activity.category) },
                ]}
              >
                <Text style={styles.activityItemEmoji}>{activity.icon}</Text>
              </View>
              <Text style={styles.activityItemTitle} numberOfLines={1}>
                {activity.title}
              </Text>
              <View style={styles.activityItemMeta}>
                <Feather name="clock" size={10} color={colors.textSecondary} />
                <Text style={styles.activityItemDuration}>{activity.duration}m</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
      marginBottom: Spacing.md,
    },
    titleSection: {
      flex: 1,
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
    },
    refreshButton: {
      padding: Spacing.sm,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.md,
    },
    activityCard: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    categoryBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryIcon: {
      fontSize: 20,
    },
    activityMeta: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    durationBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: colors.cardBackground,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    durationText: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
    },
    activityTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    activityDescription: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: Spacing.lg,
    },
    doneButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    doneButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
      gap: Spacing.xs,
    },
    viewAllButtonText: {
      fontSize: FontSizes.sm,
      color: colors.primary,
    },
    activitiesList: {
      gap: Spacing.md,
    },
    activityItem: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      minWidth: 140,
      maxWidth: 160,
      borderWidth: 2,
      alignItems: 'center',
    },
    activityItemIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    activityItemEmoji: {
      fontSize: 24,
    },
    activityItemTitle: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    activityItemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    activityItemDuration: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
    },
  });
