import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import {
  getChaptersForSubject,
  getPathwaysForCategory,
  getPathwayChapters,
} from '@/constants/curriculum';
import { useTheme, ThemeColors } from '@/components/ThemeContext';
import { useSmartyContext } from '@/context/ChatContext';

export default function Chapters() {
  const router = useRouter();
  const { colors } = useTheme();
  const { subject, class: className, isPathway } = useLocalSearchParams<{
    subject: string;
    class: string;
    isPathway?: string;
  }>();
  const { setCurrentContext } = useSmartyContext();

  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChapters = useCallback(() => {
    setLoading(true);
    let chapterList: string[] = [];

    if (className === 'Class 12+') {
      if (isPathway === 'true') {
        chapterList = getPathwayChapters(subject, '');
      } else {
        chapterList = getPathwaysForCategory(className, subject);
      }
    } else {
      chapterList = getChaptersForSubject(className, subject);
    }

    setChapters(chapterList);
    setLoading(false);
  }, [className, isPathway, subject]);

  useEffect(() => {
    if (subject && className) {
      const timer = setTimeout(() => {
        loadChapters();
        // Set chat context for chapters screen
        setCurrentContext(subject, undefined, undefined);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [subject, className, loadChapters, setCurrentContext]);

  const handleChapterPress = (chapter: string) => {
    if (chapter.includes('Coming Soon') || chapter.includes('Select')) {
      return;
    }
    router.push({
      pathname: '/lesson',
      params: { chapter, subject, class: className },
    });
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.loadingContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScrollView>
    );
  }

  const isClass12Plus = className === 'Class 12+';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={isClass12Plus ? styles.titleDark : styles.title}>{subject}</Text>
        <Text style={styles.subtitle}>{className || ''}</Text>

        {isClass12Plus && (
          <View style={styles.pathwayBadge}>
            <Text style={styles.pathwayBadgeText}>Pathway</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {isClass12Plus ? 'Topics & Chapters' : 'Chapters'}
        </Text>

        <View style={styles.chapterList}>
          {chapters.map((chapter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chapterCard,
                isClass12Plus && styles.chapterCardDark,
                (chapter.includes('Coming Soon') || chapter.includes('Select')) && styles.disabledCard,
              ]}
              onPress={() => handleChapterPress(chapter)}
              activeOpacity={chapter.includes('Coming Soon') || chapter.includes('Select') ? 1 : 0.7}
              disabled={chapter.includes('Coming Soon') || chapter.includes('Select')}
            >
              <View
                style={[
                  styles.chapterNumber,
                  isClass12Plus && styles.chapterNumberDark,
                ]}
              >
                <Text style={styles.chapterNumberText}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  styles.chapterName,
                  isClass12Plus && styles.chapterNameDark,
                ]}
              >
                {chapter}
              </Text>
              <Text
                style={[
                  styles.chapterArrow,
                  isClass12Plus && styles.chapterArrowDark,
                ]}
              >
                →
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {chapters.length > 0 && (chapters[0].includes('Coming Soon') || chapters[0].includes('Select')) && (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>🚧 Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Full curriculum content will be added soon
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.primary,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  titleDark: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: colors.charcoal,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
  },
  pathwayBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  pathwayBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.lg,
  },
  chapterList: {
    marginBottom: Spacing.xl,
  },
  chapterCard: {
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chapterCardDark: {
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  disabledCard: {
    opacity: 0.6,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  chapterNumberDark: {
    backgroundColor: colors.primaryDark,
  },
  chapterNumberText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.white,
  },
  chapterName: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: colors.text,
  },
  chapterNameDark: {
    color: colors.charcoal,
    fontWeight: FontWeights.semibold,
  },
  chapterArrow: {
    fontSize: FontSizes.lg,
    color: colors.textSecondary,
  },
  chapterArrowDark: {
    color: colors.primaryDark,
  },
  placeholderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
