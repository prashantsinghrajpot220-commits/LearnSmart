import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { mistakeAnalysisService } from '@/services/MistakeAnalysisService';
import { PersonalizedStudyPlan } from '@/types/quiz';

interface DayPlan {
  day: number;
  topic: string;
  subject: string;
  activities: string[];
  estimatedTime: number;
}

export default function PersonalizedPlanScreen() {
  const { colors, isDark } = useTheme();
  const [plan, setPlan] = useState<PersonalizedStudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  const loadPlan = async () => {
    try {
      const studyPlan = await mistakeAnalysisService.generatePersonalizedStudyPlan();
      setPlan(studyPlan);
    } catch (error) {
      console.error('Failed to load personalized plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const styles = getStyles(colors, isDark);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Creating your personalized plan...</Text>
      </View>
    );
  }

  if (!plan || plan.weakAreas.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyIcon}>🌟</Text>
        <Text style={styles.emptyTitle}>No Study Plan Needed!</Text>
        <Text style={styles.emptyText}>
          You're performing excellently. Keep up the great work!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Personalized Study Plan</Text>
          <Text style={styles.headerSubtitle}>
            {plan.estimatedCompletionDays}-day plan tailored for you
          </Text>
        </View>

        {/* Priority Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Topics</Text>
          <View style={styles.priorityContainer}>
            {plan.priorityTopics.map((topic, index) => (
              <View key={index} style={styles.priorityTag}>
                <Text style={styles.priorityTagText}>{topic}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Schedule</Text>
          {plan.suggestedSchedule.map((dayPlan) => (
            <View key={dayPlan.day} style={styles.dayCard}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggleDay(dayPlan.day)}
              >
                <View style={styles.dayInfo}>
                  <Text style={styles.dayNumber}>Day {dayPlan.day}</Text>
                  <Text style={styles.dayTopic}>{dayPlan.topic}</Text>
                </View>
                <Text style={styles.dayTime}>{dayPlan.estimatedTime} min</Text>
                <Text style={styles.expandIcon}>
                  {expandedDays.has(dayPlan.day) ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {expandedDays.has(dayPlan.day) && (
                <View style={styles.dayActivities}>
                  <Text style={styles.activitiesLabel}>Activities:</Text>
                  {dayPlan.activities.map((activity, index) => (
                    <View key={index} style={styles.activityItem}>
                      <Text style={styles.activityBullet}>•</Text>
                      <Text style={styles.activityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Today's Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: colors.textSecondary,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.md,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  priorityTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  priorityTagText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.white,
  },
  dayCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.primary,
    marginBottom: 2,
  },
  dayTopic: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
  },
  dayTime: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    marginRight: Spacing.md,
  },
  expandIcon: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
  },
  dayActivities: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: Spacing.md,
  },
  activitiesLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  activityBullet: {
    fontSize: FontSizes.md,
    color: colors.primary,
    marginRight: Spacing.sm,
    lineHeight: FontSizes.md * 1.4,
  },
  activityText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: colors.text,
    lineHeight: FontSizes.sm * 1.4,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  startButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: colors.white,
  },
});
