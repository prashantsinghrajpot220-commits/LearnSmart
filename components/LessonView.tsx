import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useUserStore } from '@/store/userStore';
import { ContentValidator } from '@/services/ContentValidator';
import { ContentType } from '@/types/content';
import AdContainer from './AdContainer';

interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

interface LessonViewProps {
  chapter: string;
  subject: string;
  className: string;
  lessonContent: LessonContent;
  currentLessonIndex: number;
  totalLessons: number;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function LessonView({
  chapter,
  subject,
  lessonContent,
  currentLessonIndex,
  totalLessons,
  onNext,
  onPrevious,
  showNavigation = true,
}: LessonViewProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const ageGroup = useUserStore((s) => s.ageGroup) ?? 'under12';
  const scrollViewRef = useRef<ScrollView>(null);

  const contentId = useMemo(
    () => `lesson:${subject}:${chapter}:${lessonContent.title}`,
    [subject, chapter, lessonContent.title]
  );

  const syncValidated = useMemo(
    () =>
      ContentValidator.validateLessonContentSync(lessonContent, {
        contentId,
        ageGroup,
        source: 'LessonView',
      }),
    [lessonContent, contentId, ageGroup]
  );

  const [isQuarantined, setIsQuarantined] = useState(false);
  const [contentBlockedMessage, setContentBlockedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsQuarantined(false);
      setContentBlockedMessage(null);

      const combinedText = [
        lessonContent.title,
        ...(lessonContent.bulletPoints || []),
        ...(lessonContent.paragraphs || []),
      ].join('\n');

      const { result } = await ContentValidator.validateText({
        text: combinedText,
        context: {
          contentId,
          contentType: ContentType.Lesson,
          ageGroup,
          source: 'LessonView',
        },
      });

      if (cancelled) return;

      if (result.decision === 'quarantine' || result.decision === 'block') {
        setIsQuarantined(true);
        setContentBlockedMessage(result.fallbackText ?? 'This lesson is temporarily unavailable.');
      }
    };

    run().catch((err) => {
      console.warn('Lesson safety check failed:', err);
    });

    return () => {
      cancelled = true;
    };
  }, [lessonContent, contentId, ageGroup]);

  const handleBack = () => {
    router.back();
  };

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < totalLessons - 1;

  const styles = getStyles(colors, isDark);

  const isOriginalEmpty =
    (lessonContent.paragraphs?.length ?? 0) === 0 && (lessonContent.bulletPoints?.length ?? 0) === 0;

  const displayLessonContent = isQuarantined ? null : syncValidated.content;

  const emptyMessage =
    contentBlockedMessage ??
    (!isOriginalEmpty && syncValidated.decision === 'filter'
      ? 'This lesson is not available for your age group.'
      : 'Lesson content coming soon');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.chapterBadge}>
            <Text style={styles.chapterBadgeText}>
              {subject} • {chapter}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.lessonCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{displayLessonContent?.icon || '📖'}</Text>
          </View>

          <Text style={styles.lessonTitle}>{displayLessonContent?.title || lessonContent.title}</Text>

          <View style={styles.divider} />

          {displayLessonContent ? (
            <>
              <View style={styles.contentSection}>
                {displayLessonContent.bulletPoints.map((point, index) => (
                  <View key={index} style={styles.bulletPointContainer}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletPointText}>{point}</Text>
                  </View>
                ))}
              </View>

              {displayLessonContent.paragraphs.map((paragraph, index) => (
                <View key={`para-${index}`} style={styles.paragraphContainer}>
                  <Text style={styles.paragraphText}>{paragraph}</Text>
                </View>
              ))}

              {displayLessonContent.paragraphs.length === 0 && displayLessonContent.bulletPoints.length === 0 && (
                <View style={styles.emptyContent}>
                  <Text style={styles.emptyText}>{emptyMessage}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          )}
        </View>

        {/* Advertisement Banner */}
        <AdContainer />

        {showNavigation && (
          <View style={styles.navigationSpacer} />
        )}
      </ScrollView>

      {showNavigation && (
        <View style={styles.navigationContainer}>
          <View style={styles.navigationRow}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.prevButton,
                !hasPrevious && styles.navButtonDisabled,
              ]}
              onPress={onPrevious}
              disabled={!hasPrevious}
              activeOpacity={hasPrevious ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.prevButtonText,
                  !hasPrevious && styles.navButtonTextDisabled,
                ]}
              >
                ← Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.lessonIndicator}>
              <Text style={styles.lessonIndicatorText}>
                {currentLessonIndex + 1} / {totalLessons}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                !hasNext && styles.navButtonDisabled,
              ]}
              onPress={onNext}
              disabled={!hasNext}
              activeOpacity={hasNext ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.nextButtonText,
                  !hasNext && styles.navButtonTextDisabled,
                ]}
              >
                Next →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingTop: Platform.select({ web: Spacing.lg, default: Spacing.lg + 20 }),
    paddingBottom: Spacing.md,
    backgroundColor: colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: colors.primary,
    fontWeight: FontWeights.semibold,
  },
  chapterBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  chapterBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  lessonCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 64,
  },
  lessonTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: isDark ? colors.text : colors.charcoal,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  divider: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginBottom: Spacing.xl,
    width: 60,
    alignSelf: 'center',
  },
  contentSection: {
    marginBottom: Spacing.lg,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  bulletPoint: {
    fontSize: FontSizes.lg,
    color: colors.primary,
    marginRight: Spacing.sm,
    lineHeight: FontSizes.lg * 1.4,
  },
  bulletPointText: {
    fontSize: FontSizes.md,
    color: colors.text,
    flex: 1,
    lineHeight: FontSizes.md * 1.5,
  },
  paragraphContainer: {
    marginBottom: Spacing.md,
  },
  paragraphText: {
    fontSize: FontSizes.md,
    color: colors.text,
    lineHeight: FontSizes.md * 1.6,
    textAlign: 'justify',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  navigationSpacer: {
    height: Spacing.xl,
  },
  navigationContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  prevButton: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  navButtonDisabled: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.lightGray,
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  prevButtonText: {
    color: colors.primary,
  },
  nextButtonText: {
    color: colors.white,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  lessonIndicator: {
    paddingHorizontal: Spacing.md,
  },
  lessonIndicatorText: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
