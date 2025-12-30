import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';
import { SENIOR_PATHWAYS } from '@/data/seniorData';

interface Pathway {
  id: string;
  category: string;
  title: string;
  icon: string;
  description: string;
}

export default function PathwaysTab() {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePathwayPress = (pathway: Pathway) => {
    // Navigate to chapters screen with pathway details
    router.push({
      pathname: '/chapters',
      params: {
        subject: pathway.category,
        class: 'Class 12+',
        pathwayId: pathway.id,
        isPathway: 'true',
      },
    });
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {/* Competitive Exams Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              <Feather name="target" size={20} color={colors.white} />
            </View>
            <Text style={styles.categoryTitle}>Competitive Exams</Text>
          </View>
          <View style={styles.pathwaysGrid}>
            {SENIOR_PATHWAYS.filter(p => p.category === 'Competitive Exams').map((pathway) => (
              <TouchableOpacity
                key={pathway.id}
                style={styles.pathwayCard}
                onPress={() => handlePathwayPress(pathway)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.pathwayIcon}>
                    <Feather name={pathway.icon as keyof typeof Feather.glyphMap} size={24} color={colors.white} />
                  </View>
                  <Text style={styles.pathwayTitle}>{pathway.title}</Text>
                </View>
                <Text style={styles.pathwayDescription} numberOfLines={2}>
                  {pathway.description}
                </Text>
                <View style={styles.cardFooter}>
                  <Feather name="chevron-right" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skill Building Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              <Feather name="tool" size={20} color={colors.white} />
            </View>
            <Text style={styles.categoryTitle}>Skill Building</Text>
          </View>
          <View style={styles.pathwaysGrid}>
            {SENIOR_PATHWAYS.filter(p => p.category === 'Skill Building').map((pathway) => (
              <TouchableOpacity
                key={pathway.id}
                style={styles.pathwayCard}
                onPress={() => handlePathwayPress(pathway)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.pathwayIcon}>
                    <Feather name={pathway.icon as keyof typeof Feather.glyphMap} size={24} color={colors.white} />
                  </View>
                  <Text style={styles.pathwayTitle}>{pathway.title}</Text>
                </View>
                <Text style={styles.pathwayDescription} numberOfLines={2}>
                  {pathway.description}
                </Text>
                <View style={styles.cardFooter}>
                  <Feather name="chevron-right" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => {
  const maturePrimary = colors.maturePrimary ?? '#7A9970';
  const matureText = colors.matureText ?? '#1A1A1A';

  return StyleSheet.create({
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
    categorySection: {
      marginBottom: Spacing.xl,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    categoryIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: maturePrimary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    categoryTitle: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.semibold,
      color: matureText,
    },
    pathwaysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -Spacing.sm,
    },
    pathwayCard: {
      backgroundColor: colors.cardBackground,
      flexBasis: Platform.select({ web: '48%', default: '46%' }),
      margin: Spacing.sm,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.lightGray,
      minHeight: 140,
      justifyContent: 'space-between',
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      marginBottom: Spacing.sm,
    },
    pathwayIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: maturePrimary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    pathwayTitle: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      color: matureText,
      lineHeight: 22,
    },
    pathwayDescription: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 18,
      flex: 1,
      marginBottom: Spacing.sm,
    },
    cardFooter: {
      alignItems: 'flex-end',
    },
  });
};
