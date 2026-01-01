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
import { analyticsService } from '@/services/AnalyticsService';
import { PerformanceMetrics, TopicPerformance } from '@/types/analytics';
import PerformanceChart from '@/components/PerformanceChart';

export default function AnalyticsScreen() {
  const { colors, isDark } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'topics'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [performanceMetrics, topics] = await Promise.all([
        Promise.resolve(analyticsService.getPerformanceMetrics()),
        Promise.resolve(analyticsService.getTopicPerformance()),
      ]);
      setMetrics(performanceMetrics);
      setTopicPerformance(topics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colors, isDark);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (!metrics) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyTitle}>No Data Yet</Text>
        <Text style={styles.emptyText}>
          Take some quizzes to see your analytics!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Analytics</Text>
          <Text style={styles.headerSubtitle}>
            Track your learning progress
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'topics' && styles.activeTab]}
            onPress={() => setSelectedTab('topics')}
          >
            <Text style={[styles.tabText, selectedTab === 'topics' && styles.activeTabText]}>
              Topics
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'overview' ? (
          <>
            {/* Key Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Accuracy</Text>
                <Text style={styles.metricValue}>{metrics.overallAccuracy}%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Quizzes</Text>
                <Text style={styles.metricValue}>{metrics.quizzesTaken}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Questions</Text>
                <Text style={styles.metricValue}>{metrics.totalQuestionsAttempted}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Avg Score</Text>
                <Text style={styles.metricValue}>{metrics.averageScore}%</Text>
              </View>
            </View>

            {/* Performance Chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Trend</Text>
              <PerformanceChart />
            </View>

            {/* Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Insights</Text>
              <View style={styles.insightsList}>
                {analyticsService.getInsights().map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Text style={styles.insightBullet}>•</Text>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Topic Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Topic Performance</Text>
              {topicPerformance.length === 0 ? (
                <Text style={styles.emptyText}>
                  No topic data available yet
                </Text>
              ) : (
                topicPerformance.slice(0, 10).map((topic, index) => (
                  <View key={index} style={styles.topicCard}>
                    <View style={styles.topicHeader}>
                      <Text style={styles.topicName}>{topic.topic}</Text>
                      <Text style={styles.topicAccuracy}>{topic.accuracy}%</Text>
                    </View>
                    <View style={styles.topicMeta}>
                      <Text style={styles.topicMetaText}>
                        {topic.subject} • {topic.chapter}
                      </Text>
                    </View>
                    <View style={styles.topicProgressBar}>
                      <View
                        style={[
                          styles.topicProgressFill,
                          {
                            width: `${topic.accuracy}%`,
                            backgroundColor:
                              topic.accuracy >= 70
                                ? colors.success
                                : topic.accuracy >= 50
                                ? colors.warning
                                : colors.error,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
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
    marginBottom: Spacing.lg,
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.text,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: FontWeights.semibold,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  metricLabel: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: colors.primary,
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
  insightsList: {
    gap: Spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightBullet: {
    fontSize: FontSizes.lg,
    color: colors.primary,
    marginRight: Spacing.sm,
    lineHeight: FontSizes.lg * 1.4,
  },
  insightText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: colors.text,
    lineHeight: FontSizes.sm * 1.5,
  },
  topicCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  topicName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
    flex: 1,
  },
  topicAccuracy: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: colors.primary,
  },
  topicMeta: {
    marginBottom: Spacing.sm,
  },
  topicMetaText: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
  },
  topicProgressBar: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  topicProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
