import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getPathwayCategories } from '@/constants/curriculum';
import { useTheme, ThemeColors } from './ThemeContext';

interface Pathway {
  id: string;
  name: string;
  icon: string;
}

export default function PathwaysView() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { class: className } = useLocalSearchParams<{ class: string }>();

  const categories = getPathwayCategories();

  const handleCategoryPress = (category: Pathway) => {
    router.push({
      pathname: '/chapters',
      params: { subject: category.name, class: className, isPathway: 'true' },
    });
  };

  const styles = getStyles(colors, isDark);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            Select a category to explore courses and pathways
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Tip</Text>
          <Text style={styles.infoText}>
            You can switch between pathways at any time. Your progress is saved automatically.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  categoriesContainer: {
    marginBottom: Spacing.xl,
  },
  categoryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
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
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryName: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
  },
  categoryArrow: {
    fontSize: FontSizes.lg,
    color: colors.primary,
    fontWeight: FontWeights.semibold,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
