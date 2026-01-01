import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { mistakeAnalysisService } from '@/services/MistakeAnalysisService';
import { WeakArea } from '@/types/quiz';
import WeakAreaCard from '@/components/WeakAreaCard';

export default function WeakAreasScreen() {
  const { colors, isDark } = useTheme();
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeakAreas = async () => {
    try {
      const areas = await mistakeAnalysisService.identifyWeakAreas();
      setWeakAreas(areas);
    } catch (error) {
      console.error('Failed to load weak areas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeakAreas();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeakAreas();
  };

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weak Areas Analysis</Text>
        <Text style={styles.headerSubtitle}>
          Topics where you need more practice
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analyzing your performance...</Text>
          </View>
        ) : weakAreas.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>No Weak Areas Found!</Text>
            <Text style={styles.emptyText}>
              You're doing great across all topics. Keep up the good work!
            </Text>
          </View>
        ) : (
          <View style={styles.areasList}>
            {weakAreas.map((area, index) => (
              <WeakAreaCard
                key={`${area.subject}-${area.topic}-${index}`}
                weakArea={area}
                rank={index + 1}
              />
            ))}
          </View>
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: colors.cardBackground,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
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
  areasList: {
    gap: Spacing.md,
  },
});
