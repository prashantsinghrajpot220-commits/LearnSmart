import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { timerService } from '@/services/TimerService';
import { PomodoroSession } from '@/types/productivity';
import { Feather } from '@expo/vector-icons';
import SessionCard from '@/components/SessionCard';

export default function SessionHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalStudyTime: 0,
    averageFocusScore: 0,
    treesGrown: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(7);

  useEffect(() => {
    loadSessions();
  }, [filterDays]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const [sessionData, statsData] = await Promise.all([
        timerService.getSessionHistory(filterDays),
        timerService.getStats(filterDays),
      ]);
      
      // Sort sessions by start time (newest first)
      const sortedSessions = sessionData.sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      setSessions(sortedSessions);
      setStats(statsData);
    } catch (error) {
                  // Debug statement removed
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFocusScoreColor = (score: number): string => {
    if (score >= 90) return colors.success;
    if (score >= 70) return '#8BC34A';
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session History</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Feather name="clock" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalStudyTime}m</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="target" size={24} color={colors.success} />
            <Text style={styles.statValue}>{stats.averageFocusScore}%</Text>
            <Text style={styles.statLabel}>Avg Focus</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="activity" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.treesGrown}</Text>
            <Text style={styles.statLabel}>Trees Grown</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="target" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Filter Options */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Time Period:</Text>
          <View style={styles.filterButtons}>
            {[
              { label: '7 Days', value: 7 },
              { label: '14 Days', value: 14 },
              { label: '30 Days', value: 30 },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  filterDays === option.value && styles.filterButtonActive,
                ]}
                onPress={() => setFilterDays(option.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterDays === option.value && styles.filterButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sessions List */}
        <Text style={styles.sectionTitle}>Sessions</Text>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No Sessions Yet</Text>
            <Text style={styles.emptyText}>
              Start a Pomodoro session to track your progress
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start First Session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              colors={colors}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: 60,
      paddingBottom: Spacing.md,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    backButton: {
      padding: Spacing.sm,
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FontSizes.md,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    statCard: {
      flex: 1,
      minWidth: 140,
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    filterContainer: {
      marginBottom: Spacing.lg,
    },
    filterLabel: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    filterButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      color: colors.text,
    },
    filterButtonTextActive: {
      color: colors.white,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: Spacing.md,
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
      fontSize: FontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
    },
    startButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: colors.white,
    },
  });
